# Event Horizon

Сайт + Telegram Mini App + бот по астрономии на 4 языках: հայերեն, русский, English, español. Новости рассказывает «ведущий» — объект, о котором новость: чёрная дыра, Марс, Солнце, галактика, комета.

## Что внутри

| Раздел | Что делает | Откуда данные |
|---|---|---|
| **Today** | Ведущий печатает свежую новость, сам меняется под тему. Ниже — что видно на небе сегодня и фото дня NASA | Spaceflight News API, NASA APOD, расчёт орбит |
| **News** | Лента с фильтрами по темам. Тап по карточке — ведущий рассказывает её | Spaceflight News API (обновление каждые 15 мин) |
| **Planets** | Реальные положения планет сейчас и ±2 года, расстояние до Земли, время света, видимость | Орбитальные элементы JPL (проверено по противостояниям Марса 2025, Юпитера 2024, Сатурна 2025) |
| **Learn** | Бесплатно: Orbits, Phases of the Moon, Gravity on other worlds. Pro: Kepler's laws, The true scale, Near the horizon, The expanding universe | Свои симуляции |
| **Pro** | Подписка за Telegram Stars, 30 дней с автопродлением | Telegram Payments |

Бот: `/start`, `/news`, `/sky`, `/pro`, `/status`, `/digest`, `/lang`, `/paysupport`, `/terms`. Язык бота берётся из Telegram, `/lang` меняет его; на сайте — переключатель в шапке. Тексты новостей остаются на языке источника (английском). Для админа: `/stats`, `/refund <charge_id>`.
Pro-подписчики каждое утро получают дайджест в Telegram.

**Защита Pro.** Сервер проверяет подпись Telegram (initData) на каждом запросе. Pro-уроки отдаются только с сервера и только подписчикам — в коде сайта их нет. Архив новостей глубже 24 статей тоже закрыт на сервере.

## Структура

```
web/                 фронтенд без сборки (общий для обоих вариантов деплоя)
pro_lessons/         Pro-уроки, отдаются только подписчикам через API
netlify/             вариант 1: Netlify (бесплатно)
  functions/api.mjs          /api/* — новости, фото дня, профиль, счёт на оплату, Pro-уроки
  functions/telegram.mjs     webhook бота: команды, кнопки, оплата Stars
  functions/tg-setup.mjs     /tg/setup — привязывает бота к сайту (открыть один раз)
  functions/refresh-news.mjs каждые 15 мин обновляет новости и фото дня
  functions/digest.mjs       каждый час после DIGEST_HOUR_UTC шлёт утренний дайджест
  lib/                       Telegram, хранилище (Netlify Blobs), новости, логика бота
server/              вариант 2: свой сервер на Python (Railway, Oracle, VPS)
deploy/              Docker Compose + HTTPS для своего сервера
tests/               тесты Netlify-версии: npm test
```

Используй **один** вариант. Если бот уже привязан к Netlify (webhook), Python-сервер его не получит, и наоборот.

## Деплой на Netlify (бесплатно)

**Что подготовить:** бот в @BotFather (`/newbot`, сохрани токен и имя), свой Telegram ID (@userinfobot), ключ NASA (api.nasa.gov, бесплатно).

1. Залей проект в репозиторий на GitHub.
2. Netlify → **Add new project → Import an existing project** → выбери репозиторий. Настройки сборки подтянутся из `netlify.toml`, ничего менять не надо.
3. **Site configuration → Environment variables** → добавь:
   ```
   BOT_TOKEN        токен из BotFather
   BOT_USERNAME     имя бота без @
   ADMIN_IDS        твой Telegram ID
   NASA_API_KEY     ключ NASA
   PRO_PRICE_STARS  150
   DIGEST_HOUR_UTC  5
   ```
   Если подключишь свой домен, добавь `PUBLIC_URL=https://твой-домен`. Без него используется адрес `*.netlify.app`.
4. **Deploys → Trigger deploy**, чтобы сборка подхватила переменные.
5. Открой в браузере `https://<сайт>.netlify.app/tg/setup`. Должно быть три галочки: Webhook, Menu button, Commands.
6. Напиши боту `/start`.

Ключи лежат только в переменных Netlify. В коде, в GitHub и в браузере (F12) их нет.

### Без GitHub (прямо с компьютера)

Нужен Node.js 20+. В папке проекта:
```bash
npm install
npx netlify-cli login            # откроет браузер, войди в Netlify
npx netlify-cli sites:create     # создаст сайт, придумай имя
npm run deploy                   # соберёт и выложит сайт с функциями
```
Переменные: скопируй `.env.example` в `.env`, впиши значения и выполни `npm run env` — они загрузятся в Netlify. Затем снова `npm run deploy` и открой `/tg/setup`. Каждый `npm run deploy` — это продакшн-деплой (15 кредитов).

**Бесплатный план Netlify — 300 кредитов в месяц.** Главное, что их тратит:
- **каждый продакшн-деплой — 15 кредитов.** Не пушь в main по мелочи: собирай правки и деплой пачкой (20 деплоев = весь месяц);
- трафик — 20 кредитов за ГБ, функции и запросы — копейки при нашем объёме.
Когда кредиты кончаются, сайт ставится на паузу до следующего месяца. Netlify предупреждает на 50%, 75% и 100%. Расход смотри в Usage.

**Ограничения:** функция работает до 30 секунд за запуск. Дайджест рассылается порциями и продолжает с того места, где остановился, — до нескольких сотен Pro-пользователей в час. Бот иногда отвечает на 1–2 секунды дольше (холодный старт).

### Проверка оплаты
Купи подписку сам (`/pro`). Бот пришлёт админу сообщение с `charge_id`. Вернуть звёзды: `/refund <charge_id>`, статистика: `/stats`. Звёзды копятся на балансе бота; вывод в TON через Fragment — по текущим условиям Telegram.

## Свой сервер (Railway, Oracle Cloud, VPS)

Тот же сайт и бот, но на Python-сервере с SQLite.

**Railway:** New Project → Deploy from GitHub; Volume на `/data`; Generate Domain; переменные из `.env.example` (`PUBLIC_URL` = выданный домен, `DB_PATH=/data/event_horizon.db`). Проверка: `https://<домен>/health`. Бесплатно только первый месяц.

**Oracle Cloud Always Free** (бесплатно навсегда, HTTPS через `*.sslip.io`):
1. Создай инстанс Ubuntu, форма Ampere A1 (1 OCPU, 6 ГБ). Открой порты 80 и 443 в Security List.
2. На сервере в папке проекта:
   ```bash
   bash deploy/setup.sh      # создаст .env
   nano .env                 # вставь BOT_TOKEN, BOT_USERNAME, ADMIN_IDS, NASA_API_KEY
   bash deploy/setup.sh      # соберёт, запустит и выведет адрес сайта
   ```
3. Обновление: `bash deploy/update.sh`.

Если до этого бот был на Netlify, сначала сними webhook: открой `https://api.telegram.org/bot<ТОКЕН>/deleteWebhook` (в своём браузере, не в чатах).

## Локальная разработка

```bash
npm install && npm test          # тесты Netlify-функций (без сети, с фейковым Telegram)
pip install -r server/requirements.txt  # Python-сервер
python -m server.main            # http://localhost:8080 (без BOT_TOKEN — только сайт)
```

## Что дальше
- Вход через Telegram Login Widget на обычном сайте (сейчас Pro открывается внутри Telegram).
- Свои анимации ведущих для конкретных новостей (кольцо M87*, гравитационные волны).
- Переводы интерфейса (RU/AM).
- Новые Pro-уроки: просто положи файл в `pro_lessons/` и добавь карточку в `web/js/learn.js`.
