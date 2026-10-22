# Event Horizon — приложение для Android и iOS

Нативная оболочка (Capacitor 8) вокруг того же сайта из `../web`. Страницы, шейдер чёрной дыры, планеты и уроки лежат внутри приложения; новости, фото дня и Pro-уроки приходят с API на Netlify.

## Один раз

Впиши адрес сайта в `app.config.json`:
```json
{ "api": "https://eventt-horizon.netlify.app" }
```
API уже разрешает запросы из приложения (CORS для `capacitor://localhost` и `https://localhost`). Задеплой сайт после этой правки, иначе приложение не получит новости.

## Android

**Без Android Studio (через GitHub):** Settings → Secrets and variables → Actions → Variables → `EH_API` = `https://eventt-horizon.netlify.app` (необязательно — по умолчанию берётся из `app.config.json`). Каждый пуш в `event-horizon/web` или `event-horizon/mobile` собирает APK: Actions → последний запуск → Artifacts → `event-horizon-apk`. Скачай, перекинь на телефон, установи.

**С Android Studio:**
```bash
cd event-horizon/mobile
npm install
npm run android        # соберёт www/, синхронизирует и откроет проект в Android Studio
```
## Google Play

1. Один раз добавь 4 секрета с ключом загрузки: Settings → Secrets and variables → Actions → New repository secret (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`).
2. Actions → **Android release (Google Play)** → Run workflow → впиши версию (1.0.0, 1.0.1…).
3. Через ~5 минут: запуск → Artifacts → `event-horizon-aab` → `app-release.aab` загружаешь в Play Console.

Номер сборки (versionCode) растёт сам с каждым запуском. При первой загрузке оставь включённым Play App Signing: Google хранит основной ключ, а наш — только ключ загрузки, его можно сбросить через поддержку, если потеряешь.

Тексты карточки на 4 языках, ответы на анкеты и графика — в `store/`. Аккаунт разработчика — $25 один раз.

## iOS

Нужен Mac с Xcode (или облачный Mac, например Codemagic) и Apple Developer Program — $99 в год.
```bash
cd event-horizon/mobile
npm install
npm run ios            # откроет проект в Xcode
```
В Xcode: Signing & Capabilities → выбери свою команду → Product → Archive → Distribute App.

## Что отличается от сайта

- **Нет покупки Pro внутри приложения.** App Store и Google Play требуют свою оплату (комиссия 15–30%) для цифровых подписок и банят за ссылки на оплату в обход. Поэтому в приложении скрыта вкладка Pro, закрытые уроки и плашка «купить архив». Всё бесплатное работает полностью. Pro остаётся в Telegram и на сайте.
- Кнопка «назад» на Android: урок → список уроков → Today → выход.
- Скрипт Telegram Mini App в приложение не попадает.

## Иконки

Исходники в `assets/` (`icon.svg` → PNG). Поменял картинку — `npm run icons`.

## ID приложения

`space.eventhorizon.app` (в `capacitor.config.json`). После первой публикации в сторе поменять нельзя — если хочешь другой, меняй сейчас и перегенерируй платформы (`rm -rf android ios && npx cap add android && npx cap add ios && npm run icons`).
