# Страхование ОСАГО / КАСКО — статический лендинг

## Быстрый старт

Откройте `index.html` в браузере или разместите файлы на любом хостинге статики.

## Настройка перед запуском

В `assets/site.config.js` укажите:

- `url` — полный адрес сайта (`https://osagovrn.github.io/` или свой домен)
- `analytics` — ID Яндекс.Метрики / Google Analytics
- `verify` — коды верификации для поисковиков
- `legal` — реквизиты оператора сайта (наименование, ИНН, ОГРН, адрес) для футера и `privacy.html`

Также обновите домен в `sitemap.xml`.

## Сборка CSS (опционально, быстрее чем CDN)

```bash
npm install
npm run build:css
```

После сборки замените в `index.html` блок Tailwind CDN на:

```html
<link rel="stylesheet" href="assets/tailwind.css">
```

## GitHub Pages

1. Загрузите репозиторий на GitHub
2. Settings → Pages → Source: **GitHub Actions**
3. Push в `main` — workflow `.github/workflows/pages.yml` соберёт CSS и опубликует сайт

Файл `.nojekyll` уже добавлен.

## Структура

| Файл | Назначение |
|------|------------|
| `index.html` | Главная страница |
| `assets/site.js` | Логика: меню, форма, виджет, аналитика |
| `assets/env.js` | HTTP/HTTPS, пути, scroll |
| `assets/site.config.js` | Настройки сайта, реквизиты оператора и партнёра |
| `assets/legal.js` | Реквизиты оператора сайта в футере и privacy |
| `privacy.html` | Политика конфиденциальности |
| `404.html` | Страница ошибки |
