# Operations

Runbook and operational notes for the Liga Mahasiswa production deployment.

## Stack

| Layer | Provider | Notes |
|---|---|---|
| Hosting | Vercel | Project `ligamahasiswa` (org, not default user scope) |
| Framework | Next.js 16 (App Router), Turbopack | TypeScript, Tailwind CSS |
| Database | Turso (libSQL) | DB `ligamahasiswa`, region `aws-ap-northeast-1` |
| ORM | Drizzle | Schema in `src/lib/schema.ts`, migrations via `drizzle-kit push` |
| Rate limiting | Upstash Redis (REST) | `src/lib/rate-limit.ts` |
| Email | Resend | Verification / password reset flows |
| Files | Vercel Blob | Uploads (`src/components/image-upload.tsx`) |
| Payments | ToyyibPay (mock in prod) | `src/lib/toyyibpay.ts`; live keys not wired |

## Deploying

The project is linked inside the Vercel **team** org, not the personal scope. The
default scope fails with `Not authorized`, so always pass the team:

```fish
vercel --prod --yes --scope team_pYNoOZt2HV3ooeB0JGOcnTiO
```

After deploy, verify the alias once:

```fish
curl -s -o /dev/null -w "%{http_code}\n" https://ligamahasiswa.vercel.app/
```

Optional pre-deploy checks:

```fish
npm run lint
npm test
npm run build
```

## Environment variables

Managed on Vercel (Production) and mirrored in `.env.local` for local dev. All
`.env*` files are gitignored.

| Var | Purpose |
|---|---|
| `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | Turso DB + auth (use a **DB-scoped** token, not the org control-plane token) |
| `SESSION_SECRET` | JWT secret for `liga-session` cookie (HS256) |
| `SEED_SECRET` / `MIGRATE_SECRET` | Guards `/api/seed` and `/api/migrate` |
| `RESEND_API_KEY` | Transactional email |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate limiting |
| `BLOB_READ_WRITE_TOKEN` / `BLOB_STORE_ID` / `BLOB_WEBHOOK_PUBLIC_KEY` | Vercel Blob |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL / redirect base |

To sync a local `.env.production` value up to Vercel:

```fish
.\scripts\sync-prod-env.ps1
```

> Keep values **unquoted** in `.env.production`; quotes are stored literally.

## Database

- Seeding: `POST /api/seed` with `x-seed-secret: $SEED_SECRET`.
  Idempotent; re-runs fill anything missing (chapters, roles, permissions).
- Schema sync: `npm run db:push` (Drizzle). `drizzle-kit` is a dev dependency.
- The `chapter` table is the source of truth for the `/chapters` directory; the
  static labels in `src/lib/chapter-constants.ts` are only display metadata.

### Backups and retention

Turso does not keep automatic backups on all plans, so treat the database as
needing explicit snapshots:

- **Manual snapshot (recommended, e.g. weekly before deploys that run
  `db:push`):** Turso dashboard -> database `ligamahasiswa` -> Backups, or with
  the CLI: `turso db snapshot ligamahasiswa --overwrite`.
- **Retention policy:** snapshots are kept per the plan's allowance; prune old
  snapshots manually or by re-taking the snapshot with `--overwrite`.
- **Restore:** Turso dashboard -> database -> Backups -> Restore, or
  `turso db restore ligamahasiswa <snapshot-id>`. A restore creates a new DB /
  uses the chosen datetime; point `TURSO_DATABASE_URL` at the restored DB and
  re-run `npm run db:push` if the schema drifted.

## Monitoring and alerts

- Enable **Vercel Observability** (project Settings -> Observability) for
  deployment-time error stacks; run traces are available there.
- `vercel logs` streams runtime logs for a deployment, but only event lines —
  for full error stacks, open the deployment on Vercel and use the runtime log
  viewer or Observability.
- Recommended: enable **Vercel Web Analytics + Speed Insights** (one click,
  zero code) and configure Vercel alerts (email/Slack) for production
  `5xx`-rate spikes.
- Alerts to set up after launch: uptime check on `/`, error-tracker (e.g.
  Sentry) if manual crash triage is unwanted.

## Known operational notes

- Session cookie name is `liga-session` (see `src/lib/session.ts`), shared by
  all environments; changing `SESSION_SECRET` invalidates all sessions.
- Deletion is a soft delete (`deletedAt` + anonymized email); deleted users'
  sessions are rejected because auth checks `deletedAt`.
- Payments run against the ToyyibPay mock in production. Switching to live
  requires adding `TOYYIBPAY_SECRET` + `TOYYIBPAY_CATEGORY_CODE` to the prod env
  and removing the mock branch in `src/lib/toyyibpay.ts` — the redirect base
  already honors `NEXT_PUBLIC_SITE_URL`.