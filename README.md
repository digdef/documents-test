## Описание

Хранение пользовательских документов

База данных: PostgreSQL

## Запуск приложения
В файле .env объявите доступы к БД

Выполните команду

```bash
$ npm i && npm run start:dev
```

## API документация

POST: /register

example:
```bash
//type
{
    "nickname": string;
    "password": string;
    "type": "user" | "admin";
}

//example
{
    "nickname": "test",
    "password": "Qwerty1",
    "type": "user"
}
```

POST: /login

example:
```bash
//type
{
    "nickname": string;
    "password": string;
}

//example
{
    "nickname": "test",
    "password": "Qwerty1"
}
```

GET: /documents-types (AUTH: 'Authorization: Bearer TOKEN')

GET: /my-documents (AUTH: 'Authorization: Bearer TOKEN')

POST: /create (AUTH: 'Authorization: Bearer TOKEN')

example:
```bash
//type
Array<{
  name: string;
  fields: Array<{
    value: string | number | boolean | Date,
    name: string;
  }>
}>

//example
[
  {
    "name": "Права",
    "fields": [
      {
        "name": "Имя",
        "value": "string"
      },
      {
        "name": "Дата",
        "value": "2000-03-12"
      },
      {
        "name": "Номер",
        "value": 123
      }
    ]
  }
]
```
GET: /admin/users (AUTH_ADMIN: 'Authorization: Bearer TOKEN')

GET: /admin/documents (AUTH_ADMIN: 'Authorization: Bearer TOKEN')

GET: /admin/documents/:userId (AUTH_ADMIN: 'Authorization: Bearer TOKEN')

POST: /admin/create (AUTH_ADMIN: 'Authorization: Bearer TOKEN')

example:
```bash
//type
{
  name: string;
  fields: Array<{
    type: "string" | "number" | "boolean" | "date",
    name: string,
  }>;
}

//example
{
  "name": "Паспорт",
  "fields": [
    {
      "name": "Дата",
      "type": "date"
    },
    {
      "name": "Имя",
      "type": "string"
    },
  ]
}
```
POST: /admin/document/change-status (AUTH_ADMIN: 'Authorization: Bearer TOKEN')

example:
```bash
//type
{
  status: 'verified' | 'rejected' | 'requested' | 'new';
  id: number;
}

//example
{
  "status": "verified",
  "id": 1
}
```
