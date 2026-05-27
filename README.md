# Car Rental

Full-stack course project for car rental automation.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: MySQL + Prisma ORM
- Auth: JWT + bcrypt
- API docs: Swagger UI

## Project structure

- `frontend` - client app
- `backend` - REST API and database layer

## Quick start (local)

### 1) Clone and install dependencies

```bash
npm --prefix backend install
npm --prefix frontend install
```

### 2) Configure environment variables

Copy examples and update values:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

Important backend variables:

- `DATABASE_URL`
- `JWT_SECRET`

### 3) Prepare database

```bash
npm --prefix backend run prisma:migrate -- --name init
npm --prefix backend run prisma:seed
```

### 4) Run apps

```bash
npm --prefix backend run dev
npm --prefix frontend run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:3000`  
Swagger UI: `http://localhost:3000/api-docs`

## Useful scripts

Backend:

- `npm run dev`
- `npm run build`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`
- `npm run prisma:studio`

Frontend:

- `npm run dev`
- `npm run build`
- `npm run preview`

