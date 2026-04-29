# Link Shortener

A minimal link shortener built with **Next.js 12**, **TypeScript**, **Prisma**, and a **MySQL-compatible database** such as PlanetScale.

This repository currently provides the backend pieces for short-link resolution:

- a Prisma model for storing short links
- an API route for looking up a slug
- middleware that attempts to redirect slug paths to their destination URL

The homepage is still a placeholder, so think of this repo as a solid foundation rather than a finished product.

## Overview

When a user visits a short path such as `/docs`, the application extracts the slug, looks it up in the database, and returns the matching destination URL. If a match is found, the request is redirected to the full URL.

### Current capabilities

- Resolve a slug from the database using Prisma
- Fetch short-link metadata from `GET /api/[slug]`
- Attempt automatic redirect handling through `src/_middleware.ts`
- Run with strict TypeScript settings

### Current limitations

- No UI yet for creating or managing short links
- No authentication or admin dashboard
- `src/pages/index.tsx` is still an empty placeholder page
- The sample `src/pages/api/hello.ts` endpoint is still present from the starter template

## Tech stack

- **Framework:** Next.js 12
- **Language:** TypeScript
- **UI runtime:** React 18
- **Database ORM:** Prisma 4
- **Database:** MySQL / PlanetScale
- **Tooling:** ESLint, Prettier, Husky, lint-staged

## Project structure

```text
.
├── prisma/
│   └── schema.prisma         # Prisma schema and database model
├── public/                   # Static assets
├── src/
│   ├── db/
│   │   └── client.ts         # Prisma client singleton
│   ├── pages/
│   │   ├── api/
│   │   │   ├── [slug].ts     # Lookup endpoint for a short link
│   │   │   └── hello.ts      # Starter example endpoint
│   │   ├── _app.tsx          # Global app wrapper
│   │   └── index.tsx         # Placeholder homepage
│   └── _middleware.ts        # Redirect middleware
├── styles/                   # Global and module CSS
├── .env.example              # Example environment variables
├── CONTRIBUTING.md           # Contribution guide
└── README.md                 # Project documentation
```

## Database model

The application stores short links in the `ShortLink` model:

| Field       | Type       | Notes                             |
| ----------- | ---------- | --------------------------------- |
| `id`        | `Int`      | Primary key, auto-incremented     |
| `slug`      | `String`   | Unique short code used in the URL |
| `url`       | `String`   | Destination URL                   |
| `createdAt` | `DateTime` | Automatically set on create       |
| `updatedAt` | `DateTime` | Automatically updated on change   |

## API reference

### `GET /api/[slug]`

Returns the database record for the supplied slug.

#### Success response

```json
{
  "id": 1,
  "slug": "docs",
  "url": "https://example.com/docs",
  "createdAt": "2026-04-29T00:00:00.000Z",
  "updatedAt": "2026-04-29T00:00:00.000Z"
}
```

#### Error responses

- `404` — slug not found
- `500` — invalid or missing slug parameter

## How requests flow

1. A request comes in for a path like `/my-link`.
2. `src/_middleware.ts` extracts the slug from the request path.
3. The middleware queries the slug lookup API.
4. If the slug exists, the request is redirected to the stored `url`.
5. If the slug does not exist, the request continues without a redirect.

## Getting started

### Prerequisites

- Node.js 18 LTS recommended
- npm
- A MySQL-compatible database connection string

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

This repository now includes both `.env` and `.env.example` with a placeholder `DATABASE_URL`.

Update the value in `.env` with your own database connection string:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
```

### 3. Generate the Prisma client

```bash
npx prisma generate
```

### 4. Push the schema to your database

```bash
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start the Next.js development server |
| `npm run build`  | Build the app for production         |
| `npm run start`  | Start the production server          |
| `npm run lint`   | Run ESLint                           |
| `npm run pretty` | Format the repository with Prettier  |

## Development notes

- Prisma is configured in `src/db/client.ts`.
- The database provider is `mysql` in `prisma/schema.prisma`.
- `reactStrictMode` is enabled in `next.config.js`.
- TypeScript runs in strict mode.

## Troubleshooting

### Prisma client errors

If Prisma types or imports fail, regenerate the client:

```bash
npx prisma generate
```

### Database connection issues

Make sure `DATABASE_URL` is set correctly in `.env` and that your database is reachable from your local machine.

### Slug does not redirect

Check the following:

- the slug exists in the `ShortLink` table
- the `url` column contains a valid destination URL
- the API route works directly at `/api/<slug>`

## Contributing

Contributions are welcome. For contributor workflow, setup expectations, and pull request guidance, see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Future improvements

Here are a few sensible next steps for the project:

- add a form or dashboard to create short links
- add validation for URLs and slugs
- add tests for middleware and API routes
- add analytics, rate limiting, and expiration support
- add custom 404 and error pages
