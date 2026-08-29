#!/bin/bash
# Проверка v3 (de-AI редизайн): сервер + браузер + форма + мобилка
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
agent-browser wait 1200
echo "== page errors:"; agent-browser errors || true
agent-browser screenshot "$SHOTS/v3-hero.png"

agent-browser eval "window.scrollTo(0, document.getElementById('catalog').offsetTop - 70)"; sleep 1.2
agent-browser screenshot "$SHOTS/v3-catalog.png"

agent-browser eval "window.scrollTo(0, document.getElementById('why-us').offsetTop - 70)"; sleep 1.2
agent-browser screenshot "$SHOTS/v3-whyus.png"

agent-browser eval "window.scrollTo(0, document.getElementById('delivery').offsetTop - 70)"; sleep 1.2
agent-browser screenshot "$SHOTS/v3-delivery.png"

agent-browser eval "window.scrollTo(0, document.getElementById('contacts').offsetTop - 70)"; sleep 1.2
agent-browser screenshot "$SHOTS/v3-contacts.png"

echo "== filling form"
agent-browser find label "Ваше имя" fill "Тест Тестовый"
agent-browser find label "Телефон" fill "+375 29 111-22-33"
agent-browser find label "Комментарий" fill "Проверка v3"
agent-browser find role button click --name "Отправить заявку"
agent-browser wait --text "Заявка отправлена" --timeout 15000 || echo "!! toast not found"
sleep 0.6
agent-browser screenshot "$SHOTS/v3-form-success.png"

agent-browser set viewport 390 844
agent-browser open "$URL"
agent-browser wait --load networkidle
agent-browser wait 1200
agent-browser screenshot "$SHOTS/v3-mobile-hero.png"
agent-browser eval "window.scrollTo(0, document.body.scrollHeight * 0.5)"; sleep 1.2
agent-browser screenshot "$SHOTS/v3-mobile-mid.png"

echo "== ALL DONE"
