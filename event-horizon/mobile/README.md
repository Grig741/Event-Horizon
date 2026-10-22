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
Для Google Play: Build → Generate Signed App Bundle (.aab). Ключ (`.jks`) храни отдельно, без него обновления не выпустить. Аккаунт разработчика Google Play — $25 один раз.

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
