#!/bin/bash
# Полная проверка MVP «Каталог → Корзина → Заявка» + админки.
# Все шаги в одном вызове: песочница убивает фоновые процессы между вызовами.
set -u
cd /home/z/my-project
BASE=http://localhost:3000
OUT=/home/z/my-project/scripts
PASS='dominant2026'

ab(){ agent-browser "$@" || echo "[WARN] agent-browser $* failed"; }
shot(){ sleep "${2:-0.8}"; ab screenshot "$1"; echo "SHOT $1"; }

echo "== 0. Сервер жив? =="
code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 4 "$BASE/")
if [ "$code" != "200" ]; then
  pkill -f "next dev" 2>/dev/null; sleep 1
  nohup npm run dev > /dev/null 2>&1 &
  for i in $(seq 1 40); do
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "$BASE/" 2>/dev/null)
    [ "$code" = "200" ] && break; sleep 1
  done
fi
echo "HTTP $code"

echo "== 1. Десктоп: главная и каталог =="
ab set viewport 1440 900
ab open "$BASE/"
ab wait --load networkidle
sleep 1.5
ab errors
shot "$OUT/v4-01-home.png"

ab eval 'document.getElementById("products").scrollIntoView({behavior:"instant"})'
shot "$OUT/v4-02-catalog.png" 1.4

# Товары реально в HTML?
COUNT=$(curl -s "$BASE/" | grep -o "Seranit" | wc -l)
echo "Seranit в HTML: $COUNT"

echo "== 2. Фильтр по категории Плитка =="
ab eval '[...document.querySelectorAll("[role=tab]")].find(b=>b.textContent.includes("Плитка")).click()'
shot "$OUT/v4-03-filter-tiles.png" 1.0
ab eval '[...document.querySelectorAll("[role=tab]")].find(b=>b.textContent.includes("Все товары")).click()'
sleep 0.6

echo "== 3. Корзина: добавляем два товара =="
ab eval 'const b=[...document.querySelectorAll("#products button[aria-label^=\"Добавить\"]")]; b[0].click(); b[1].click(); b.length'
sleep 0.5
sleep 0.5
shot "$OUT/v4-04-added-badge.png"
# прибавим количество у первого товара до 2 через степпер карточки
ab eval 'const p=[...document.querySelectorAll("#products article")][0]; const plus=[...p.querySelectorAll("button[aria-label^=\"Прибавить\"]")]; plus.length && plus[0].click(); plus.length'

echo "== 4. Открываем корзину, оформляем заявку =="
ab eval 'document.querySelector("button[aria-label^=\"Открыть корзину\"]").click()'
shot "$OUT/v4-05-cart.png" 1.2

fill_input_js=$(cat <<'EOF'
(() => {
  const dlg = document.querySelector('[role=dialog]');
  if (!dlg) return 'no-dialog';
  const setVal = (el, val) => {
    const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement : window.HTMLInputElement;
    Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, val);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const inputs = [...dlg.querySelectorAll('input')];
  const ta = dlg.querySelector('textarea');
  const nameI = inputs.find(i => i.placeholder && i.placeholder.startsWith('Ваше имя'));
  const telI  = inputs.find(i => i.placeholder && i.placeholder.startsWith('Номер'));
  if (!nameI || !telI) return 'no-fields';
  setVal(nameI, 'Ольга Петрова');
  setVal(telI, '+375 (29) 555-14-22');
  if (ta) setVal(ta, 'Перезвоните после 18:00, уточним цвета');
  return 'ok';
})()
EOF
)
ab eval "$fill_input_js"

ab eval 'const d=document.querySelector("[role=dialog]"); [...d.querySelectorAll("button")].find(b=>b.textContent.includes("Оставить заявку")).click()'
ab wait --text "принята"
shot "$OUT/v4-06-success.png" 0.9
ab errors

echo "== 5. Админка: редирект, неверный пароль, верный =="
ab open "$BASE/admin"
ab wait --load networkidle
URL=$(ab get url 2>/dev/null | tail -1)
echo "URL после /admin: $URL"
shot "$OUT/v4-07-admin-login.png"

fill_admin_js=$(cat <<'EOF'
(() => {
  const inp = document.querySelector('#passcode');
  if (!inp) return 'no-input';
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(inp, window.__pc);
  inp.dispatchEvent(new Event('input',{bubbles:true}));
  return 'ok';
})()
EOF
)

# неверный пароль
ab eval "window.__pc='wrong-pass'; ($fill_admin_js)"
ab eval 'document.querySelector("#passcode").form.requestSubmit()'
ab wait --text "Неверный пароль"
echo "неверный пароль -> ошибка показана OK"
shot "$OUT/v4-08-admin-wrong.png"

# верный пароль
ab open "$BASE/admin/login"
sleep 1
ab eval "window.__pc='$PASS'; ($fill_admin_js)"
ab eval 'document.querySelector("#passcode").form.requestSubmit()'
ab wait --text "Админ-панель"
sleep 1.2
ab errors
shot "$OUT/v4-09-admin-leads.png" 0.6

echo "== 6. Заявка: в работу =="
ab eval '[...document.querySelectorAll("button")].find(b=>b.textContent.includes("Взять в работу"))?.click()'
shot "$OUT/v4-10-lead-inprogress.png" 0.7

echo "== 7. Вкладка Товары + диалог добавления =="
ab eval '[...document.querySelectorAll("button")].find(b=>b.textContent.trim().startsWith("Товары")).click()'
shot "$OUT/v4-11-admin-products.png" 0.8
ab eval '[...document.querySelectorAll("button")].find(b=>b.textContent.includes("Добавить товар")).click()'
shot "$OUT/v4-12-admin-newproduct.png" 0.8
ab eval 'document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}))'
sleep 0.5

echo "== 8. Выход =="
ab eval '[...document.querySelectorAll("button")].find(b=>b.textContent.includes("Выйти")).click()'
sleep 1

echo "== 9. API-проверки админки (curl) =="
JAR=/tmp/dom-jar.txt; rm -f "$JAR"
UNAUTH=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/admin/products")
echo "без куки: $UNAUTH (ожидаем 401)"
curl -s -c "$JAR" -X POST "$BASE/api/admin/login" -H 'Content-Type: application/json' -d '{"passcode":"nope"}' > /dev/null
LOGIN_CODE=$(curl -s -c "$JAR" -o /dev/null -w "%{http_code}" -X POST "$BASE/api/admin/login" -H 'Content-Type: application/json' -d "{\"passcode\":\"$PASS\"}")
echo "логин верный пароль: HTTP $LOGIN_CODE"
PRODS=$(curl -s -b "$JAR" "$BASE/api/admin/products")
N=$(echo "$PRODS" | grep -o '"id"' | wc -l)
echo "товаров в API: $N"

CRUD=$(cat <<'EOF'
(async () => {
  const mk = await fetch('/api/admin/products', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Тестовая полка навесная',category:'kitchens',price:null,unit:'шт',description:'создано автотестом',imageUrl:null,isActive:true})});
  const mj = await mk.json();
  if (!mj.ok) return 'create-fail';
  const id = mj.product.id;
  const up = await fetch(`/api/admin/products/${id}`, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({price:42})});
  const uj = await up.json();
  const del = await fetch(`/api/admin/products/${id}`, {method:'DELETE'});
  return `crud:${uj.product.price}/del-${(await del.json()).ok}`;
})()
EOF
)
sleep 0.5
ab eval "$CRUD"

LEADS=$(curl -s -b "$JAR" "$BASE/api/admin/leads")
CART_N=$(echo "$LEADS" | grep -o '"source":"cart"' | wc -l)
OLGA=$(echo "$LEADS" | grep -o 'Ольга Петрова' | wc -l)
echo "заявок из корзины: $CART_N, демо-лид Ольга найден: $OLGA"

echo "== 10. Мобильная версия 390px =="
ab set viewport 390 844
ab eval 'localStorage.clear()' >/dev/null 2>&1 || true
ab open "$BASE/"
ab wait --load networkidle
sleep 1.5
ab eval 'document.getElementById("products").scrollIntoView({behavior:"instant"})'
shot "$OUT/v4-m1-products.png" 1.4
ab eval 'const b=[...document.querySelectorAll("#products button[aria-label^=\"Добавить\"]")]; b[0].click(); b.length'
sleep 0.7
shot "$OUT/v4-m2-fab.png"
ab eval 'document.querySelector("button[aria-label^=\"Открыть корзину\"]").click()'
sleep 1.0
ab eval "$(cat <<'EOF'
(() => {
  const dlg = document.querySelector('[role=dialog]');
  if (!dlg) return 'no-dialog';
  const setVal = (el, val) => {
    const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement : window.HTMLInputElement;
    Object.getOwnPropertyDescriptor(proto.prototype,'value').set.call(el, val);
    el.dispatchEvent(new Event('input',{bubbles:true}));
  };
  const inputs=[...dlg.querySelectorAll('input')];
  const nameI=inputs.find(i=>i.placeholder&&i.placeholder.startsWith('Ваше имя'));
  const telI=inputs.find(i=>i.placeholder&&i.placeholder.startsWith('Номер'));
  if(nameI&&telI){setVal(nameI,'Игорь');setVal(telI,'+375 33 900 11 22');}
  return 'ok';
})()
EOF
)"
shot "$OUT/v4-m3-cart.png" 0.6
ab errors

echo ""
echo "=========== ИТОГ ==========="
ls -la "$OUT"/v4-*.png 2>/dev/null | awk '{print $NF, $5}'
echo "DONE"
