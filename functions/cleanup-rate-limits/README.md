# cleanup-rate-limits (Appwrite Function)

Deletes expired rows from the `rate_limits` collection. Schedule as a
cron job (suggested: `*/5 * * * *`).

## Required env

- `APPWRITE_ENDPOINT`
- `APPWRITE_PROJECT_ID`
- `APPWRITE_API_KEY` (server key with `documents.read`, `documents.write`)
- `APPWRITE_DATABASE_ID` (default `linkshort`)
- `APPWRITE_RATE_LIMITS_TABLE_ID` (default `rate_limits`)

## Build

Runtime: Node.js 22+. Entry point: `src/main.ts`.

The function only ever deletes rows whose `expiresAt` is earlier than `now`,
so running it more often is safe.
