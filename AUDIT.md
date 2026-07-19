# AVTOPLAKAT — аудит исходного сайта

## Что найдено
- Полный бэкап WordPress от 20.05.2026.
- Кастомная тема: `avtoplakat`, версия 1.0.0.
- Плагины: Advanced Custom Fields Pro, Classic Editor, Google Site Kit, Simple Custom Post Order.
- Файлов в uploads: 400.
- Размер uploads: около 27 МБ.
- Таблицы Rank Math присутствуют, хотя папки плагина в текущем бэкапе нет.

## Типы записей
```json
{
  "attachment": 114,
  "product": 111,
  "acf-field": 27,
  "page": 1,
  "revision": 7,
  "acf-field-group": 3,
  "nav_menu_item": 3
}
```

## Опубликованные записи
```json
{
  "product": 110,
  "acf-field": 27,
  "page": 1,
  "acf-field-group": 3,
  "nav_menu_item": 3
}
```

## Важное
- Корзина самописная и отправляет заказ обычной функцией PHP `mail()`.
- Старые поля заказа: имя, email, номер телефона и содержимое корзины.
- В исходном полном бэкапе есть почта, пользователи, конфигурация и потенциальные секреты. Его нельзя передавать AI-агенту целиком.
- Для Antigravity подготовлен очищенный набор: тема без шрифтов, uploads, JSON с контентом и документация.
