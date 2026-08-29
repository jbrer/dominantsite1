#!/bin/bash
# Полная проверка редизайна ДОМИНАНТ: сервер + браузер + форма + мобилка
set -e
cd /home/z/my-project
SHOTS=scripts
URL=http://localhost:3000

# 1. Старт сервера, если не отвечает
if ! curl -s -o /dev/null --max-time 3 "$URL"; then
  echo "== starting dev server"
  setsid npm run dev >> dev.log 2>&1 < /dev/null &
  SERVER_PID=$!
  for i in $(seq 1 40); do
    sleep 2
    if curl -s -o /dev/null --max-time 3 "$URL"; then break; fi
  done
fi
echo "== server ready: $(curl -s -o /dev/null -w '%{http_code}' --max-time 5 $URL)"

# 2. Десктоп: открытие, ошибки, скриншоты секций
agent-browser set viewport 1440 900
agent-browser open "$URL"
agent-browser wait --load networkidle
agent-browser wait 1200
echo "== page errors:"; agent-browser errors || true
agent-browser screenshot "$SHOTS/v2-hero.png"

agent-browser eval "window.scrollTo(0, document.getElementById('catalog').offsetTop - 70)"; sleep 1.2
agent-browser screenshot "$SHOTS/v2-catalog.png"

agent-browser eval "window.scrollTo(0, document.getElementById('why-us').offsetTop - 70)"; sleep 1.2
agent-browser screenshot "$SHOTS/v2-whyus.png"

agent-browser eval "window.scrollTo(0, document.getElementById('delivery').offsetTop - 70)"; sleep 1.2
agent-browser screenshot "$SHOTS/v2-delivery.png"

agent-browser eval "window.scrollTo(0, document.getElementById('contacts').offsetTop - 70)"; sleep 1.2
agent-browser screenshot "$SHOTS/v2-contacts.png"

agent-browser eval "window.scrollTo(0, document.body.scrollHeight)"; sleep 1.2
agent-browser screenshot "$SHOTS/v2-footer.png"

# 3. Форма: заполнение и отправка
echo "== filling form"
agent-browser snapshot -i -c > "$SHOTS/v2-snapshot.txt" || true
NAME_REF=$(rg -o 'ref=(e\d+) \[?[^]]*$' -N "$SHOTS/v2-snapshot.txt" | head -1 || true)

# используем семантические локаторы вместо ref-индексов
agent-browser find label "Ваше имя" fill "Тест Тестовый"
agent-browser find label "Телефон" fill "+375 29 111-22-33"
agent-browser find label "Комментарий" fill "Проверка формы после редизайна"
agent-browser find role button click --name "Отправить заявку"
agent-browser wait --text "Заявка отправлена" --timeout 15000 || echo "!! toast not found"
sleep 0.6
agent-browser screenshot "$SHOTS/v2-form-success.png"

# 4. Мобильная версия
agent-browser set viewport 390 844
agent-browser open "$URL"
agent-browser wait --load networkidle
agent-browser wait 1200
agent-browser screenshot "$SHOTS/v2-mobile-hero.png"
agent-browser eval "window.scrollTo(0, document.body.scrollHeight * 0.55)"; sleep 1.2
agent-browser screenshot "$SHOTS/v2-mobile-mid.png"

echo "== ALL DONE"
