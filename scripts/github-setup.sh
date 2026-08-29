#!/usr/bin/env bash
# Создаёт приватный репозиторий на GitHub и пушит ветку main.
#
# Использование (нужен Personal Access Token со scope «repo»):
#   GITHUB_TOKEN=ghp_xxx GITHUB_USER=ваш_ник bash scripts/github-setup.sh
#
# Необязательные переменные:
#   REPO_NAME  — имя репозитория (по умолчанию dominant-showroom)
#   PRIVATE    — false, если нужен публичный репозиторий (по умолчанию true)
set -euo pipefail

: "${GITHUB_TOKEN:?Задайте GITHUB_TOKEN (токен GitHub)}"
: "${GITHUB_USER:?Задайте GITHUB_USER (ваш ник на GitHub)}"

REPO_NAME="${REPO_NAME:-dominant-showroom}"
PRIVATE="${PRIVATE:-true}"
API="https://api.github.com"

cd "$(dirname "$0")/.."

echo "==> Проверяю токен..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" "${API}/user")
if [ "${HTTP_CODE}" != "200" ]; then
  echo "ОШИБКА: токен не принят GitHub (HTTP ${HTTP_CODE}). Проверьте токен и scope repo." >&2
  exit 1
fi
echo "    токен действителен"

echo "==> Создаю репозиторий ${GITHUB_USER}/${REPO_NAME} (private=${PRIVATE})..."
HTTP_CODE=$(curl -s -o /tmp/repo-response.json -w "%{http_code}" -X POST \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  -d "{\"name\":\"${REPO_NAME}\",\"private\":${PRIVATE},\"description\":\"Сайт-витрина магазина стройматериалов «ДОМИНАНТ» (Дрогичин)\"}" \
  "${API}/user/repos")
if [ "${HTTP_CODE}" = "201" ]; then
  echo "    репозиторий создан"
elif [ "${HTTP_CODE}" = "422" ]; then
  echo "    репозиторий уже существует — продолжаю"
else
  echo "ОШИБКА создания репозитория (HTTP ${HTTP_CODE}):" >&2
  cat /tmp/repo-response.json >&2
  exit 1
fi

echo "==> Настраиваю remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "==> Пушу ветку main..."
git push -u origin main

echo
echo "ГОТОВО: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo "Совет: токен сохранён в .git/config — файл никуда не отправляется."
echo "При желании токен можно отозвать на GitHub (Settings → Developer settings → Tokens)."
