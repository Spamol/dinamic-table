# Динамическая таблица с сортировкой и загрузкой данных
## Запуск проекта
Установка зависимостей:
```javascript
npm i
```
Сборка проекта
```javascript
npm run build
```
Запуск сервера
```javascript
npm run server
```
Сайт будет доступен по `localhost:3000`

## Конфиг таблицы
```javascript
[
  {
    "class":"table_ya",      // Класс обертки элемента, внутри которого сгенерируется таблица
    "theme": "default",      // Шаблон таблицы. default или web2
    "columns": [             // Массив колонок
      {
        "id": "name",        // Уникальный идентификатор колонки
        "title": "Фамилия",  // Заголовок колонки
        "sort": "sort"       // Возможность сортировки по ней
      }
    ]
  }
]
```

## Данные таблицы
```javascript
[
  {
    "name": "Mcconnell Daugherty" // Первая строка таблицы, данные для колонки "name"
  },
  {
    "name": "Иван Иванов" // Вторая строка таблицы, данные для колонки "name"
  }
]
```