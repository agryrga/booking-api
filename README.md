# Booking API

Booking API — это RESTful сервис для управления бронированием столиков в кафе с использованием JWT-аутентификации и разграничением доступа на основе ролей (USER и ADMIN).

Пользователи могут создавать, просматривать, обновлять и удалять свои бронирования, а администраторы — просматривать все бронирования в системе.

---

## Стек

- **Node.js** + **Express**
- **PostgreSQL**
- **Docker**
- **Prisma ORM**
- **JWT**
- **bcrypt**

---

## Запуск

### 1. Клонировать репозиторий и перейти в папку проекта

```bash
git clone https://github.com/agryrga/booking-api.git
cd booking-api
```

### 2. Создать `.env`

### 3. Поднять контейнеры

```bash
docker compose up --build
```

### 4. Применить миграции и сгенерировать Prisma Client

```bash
docker compose exec app npx prisma migrate dev --name init
docker compose exec app npx prisma generate
```
