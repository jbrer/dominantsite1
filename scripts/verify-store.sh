#!/bin/bash
# Проверка реструктуризации «магазин вместо лендинга» (Task 12 на базе v4):
# сервер + шрифт заголовков + секции + скриншоты десктоп/мобилка.
set -e
cd /home/z/my-project
SHOTS=scripts
URL=http://localhost:3000

if ! curl -s -o /dev/null --max-time 3 "$URL"; then
  echo "== starting dev server"
  setsid npm run dev >> dev.log 2>&1 < /dev/null &
  for i in $(seq 1 40); do
    sleep 2
    if curl -s -o /dev/null --max-time 3 "$URL"; then break; fi
  done
fi
echo "== server ready: $(curl -s -o /dev/null -w '%{http_code}' --max-time 5 $URL)"

agent-browser set viewport 1440 900
agent-browser open "$URL"
agent-browser wait --load networkidle
agent-browser wait 1500
echo "== page errors:"; agent-browser errors || true

echo "== h1 font (ожидаём Playfair Display):"
agent-browser eval "getComputedStyle(document.querySelector('h1')).fontFamily"

echo "== секции на странице:"
agent-browser eval "['top','products','why-us','delivery','contacts'].map(id => id + ':' + !!document.getElementById(id)).join(' | ')"

# Верх: вводная полоса + факты + плитки категорий
agent-browser screenshot "$SHOTS/t12-01-top.png"
agent-browser eval "window.scrollTo(0, document.getElementById('products').offsetTop - 60)"; sleep 1.2
agent-browser screenshot "$SHOTS/t12-02-catalog-tiles.png"
# Сетка товаров
agent-browser eval "window.scrollBy(0, 620)"; sleep 1.0
agent-browser screenshot "$SHOTS/t12-03-products.png"
# Фильтр: клик по плитке «Плитка»
agent-browser eval "window.scrollTo(0, document.getElementById('products').offsetTop - 60)"; sleep 0.8
agent-browser eval "[...document.querySelectorAll('#products [role=tab]')].find(b => b.textContent.includes('Плитка'))?.click()"; sleep 1.0
agent-browser screenshot "$SHOTS/t12-04-filter-tiles.png"
agent-browser eval "[...document.querySelectorAll('#products button')].find(b => b.textContent.trim() === 'Сбросить')?.click()"; sleep 0.6

agent-browser eval "window.scrollTo(0, document.getElementById('why-us').offsetTop - 70)"; sleep 1.2
agent-browser screenshot "$SHOTS/t12-05-whyus.png"
agent-browser eval "window.scrollTo(0, document.getElementById('delivery').offsetTop - 70)"; sleep 1.2
agent-browser screenshot "$SHOTS/t12-06-delivery.png"
agent-browser eval "window.scrollTo(0, document.getElementById('contacts').offsetTop - 70)"; sleep 1.2
agent-browser screenshot "$SHOTS/t12-07-contacts.png"
# Футер
agent-browser eval "window.scrollTo(0, document.body.scrollHeight)"; sleep 1.0
agent-browser screenshot "$SHOTS/t12-08-footer.png"

# Мобильная версия
agent-browser set viewport 390 844
agent-browser open "$URL"
agent-browser wait --load networkidle
agent-browser wait 1500
agent-browser screenshot "$SHOTS/t12-m1-top.png"
agent-browser eval "window.scrollTo(0, document.getElementById('products').offsetTop - 60)"; sleep 1.2
agent-browser screenshot "$SHOTS/t12-m2-catalog.png"
agent-browser eval "window.scrollBy(0, 700)"; sleep 1.0
agent-browser screenshot "$SHOTS/t12-m3-products.png"

echo "== DONE"
