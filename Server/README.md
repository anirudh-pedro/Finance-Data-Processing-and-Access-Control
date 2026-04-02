# Finance Dashboard Backend

Role-based backend system for managing financial records and generating analytics.
Built with Node.js, Express, Prisma, and PostgreSQL (Neon).

## Tech Stack

- Node.js
- Express
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- Zod Validation

## Features

- JWT-based authentication
- Role-based access control (`ADMIN`, `ANALYST`, `VIEWER`)
- User management with role/status updates and last-admin protection
- Financial records CRUD with filtering and pagination
- Dashboard analytics (summary, category-wise, trends, recent)
- Centralized error handling and standardized API responses
- Rate limiting for security hardening

## Project Structure

```text
src/
  modules/
    auth/
    user/
    finance/
    dashboard/
  middleware/
  config/
  utils/
  validation/
```

## Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root:
   ```env
   DATABASE_URL="your_neon_postgres_connection_string"
   JWT_SECRET="your_jwt_secret"
   PORT=5000
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API (High-Level)

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Users

- `GET /users` (admin only)
- `PATCH /users/:id` (admin only)
- `GET /users/:id` (admin can view any; others can view self)

### Records

- `POST /records`
- `GET /records`
- `PUT /records/:id`
- `DELETE /records/:id`

### Dashboard

- `GET /dashboard/summary`
- `GET /dashboard/categories`
- `GET /dashboard/trends`
- `GET /dashboard/recent`

## Request Lifecycle

`Request -> Auth Middleware -> Role Middleware -> Controller -> Service -> Prisma -> Database -> Response`

## Assumptions

- `ADMIN` has full access
- `ANALYST` and `VIEWER` have restricted access based on role rules
- System is single-tenant

## Future Improvements

- Soft delete support for records
- Unit and integration test suites
