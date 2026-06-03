# Green House Demo — Fakoor Peyvand Aria

Smart greenhouse operations management system (Persian RTL UI).

## Quick Start

```bash
npm install
npx prisma generate
# Configure DATABASE_URL in .env (SQL Server)
npm run dev
```

Open **http://localhost:3001**

Admin credentials for seeding: configure locally in `prisma/seed.ts` (not documented here).

## Documentation

| Language | File |
|----------|------|
| **فارسی** | [docs/DOCUMENTATION.fa.md](./docs/DOCUMENTATION.fa.md) |
| **English** | [docs/DOCUMENTATION.en.md](./docs/DOCUMENTATION.en.md) |

Full coverage includes: architecture, authentication, database model, all dashboard modules, QR public pages, deployment, and troubleshooting.

## Tech Stack

Next.js 16 · React 19 · Ant Design 5 · Tailwind 4 · Prisma 6 · SQL Server

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3001 |
| `npm run build` | Production build (standalone) |
| `npm start` | Run `server.js` |
| `npx prisma db seed` | Ensure admin user |

## Project Layout

- `app/` — routes and layouts (App Router)
- `features/` — domain modules (services + components)
- `shared/` — shared UI components
- `lib/` — auth, session, Prisma client
- `prisma/` — schema and migrations
