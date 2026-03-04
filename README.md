# Kazakh Site — материалы для уроков

Локально: простой статический фронтенд и опциональный Node.js сервер для загрузок.

Quick start (локально):

```bash
cd "C:\Users\Alpha\OneDrive\Desktop\kazakh_site"
# убедитесь, что в проекте есть package.json (см. ниже)
npm install
npm start
# Откройте http://localhost:3000
```

Деплой на Render (бесплатный способ с поддержкой Node.js):

1. Создайте GitHub репозиторий и запушьте код:

```bash
cd "C:\Users\Alpha\OneDrive\Desktop\kazakh_site"
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/ВАШ_ЮЗЕР/ИМЯ_РЕПО.git
git push -u origin main
```

2. Зарегистрируйтесь на https://render.com и создайте новый **Web Service**.
   - Подключите ваш GitHub репозиторий.
   - Branch: `main`.
   - Build Command: `npm install`
   - Start Command: `npm start`

3. Нажмите Deploy — через несколько минут сайт будет доступен по адресу render.app.

Важно про файлы и хранение:
- В текущей реализации загруженные файлы сохраняются в папке `uploads` на сервере. На бесплатных платформах файловая система может быть непостоянной при пересборке/перезапуске сервиса. Для постоянного хранения подключите S3/Firebase Storage.

> **package.json**
> 1. Если вы клонируете репозиторий с GitHub, убедитесь, что `package.json` присутствует и закоммичен: Render и другие хосты запускают `npm install`, и без него сборка завершается ошибкой `ENOENT`.
> 2. Пример содержимого:
>
> ```json
> {
>   "name": "kazakh_site",
>   "version": "1.0.0",
>   "scripts": { "start": "node server.js" },
>   "dependencies": { "express": "^4.18.2", "multer": "^1.4.5" }
> }
> ```
> 3. Если хотите добавить новые зависимости, делайте `npm install <pkg> --save` и повторно коммитьте/пушьте.

Если хотите, могу подготовить настройки для загрузки в S3 или помочь пошагово сделать деплой на Render (вам нужно будет авторизоваться в Render и GitHub — я не запрашиваю пароли).
