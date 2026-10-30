# Test Results

Environment: Windows, Node 24, Next.js 15.5.28, `@supabase/supabase-js` 2.x.

## Automated checks

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | Pass |
| Production build | `npm run build` | Pass (19 routes) |
| Seed data tests | `npm test` | Pass (7/7) |

## Database checks (isolated PostgreSQL 17, not the hosted project)

The hosted Supabase project was not available, and the local Supabase stack could not start because Docker Hub rate-limited the image pulls. Instead the migration was applied to a plain `postgres:17-alpine` container with minimal stand-ins for `auth`, `storage`, `anon`, and `authenticated`. Results:

| Test | Result |
| --- | --- |
| Migration applies cleanly (`ON_ERROR_STOP=1`) | Pass |
| Signed-in user sees catalog spots | Pass (1 row) |
| `create_demo_booking` uses the package price from the catalog | Pass (1500.00) |
| Other user cannot see another user's bookings | Pass (0 rows) |
| Reusing another user's request ID is rejected | Pass (`Invalid request ID`) |

Caveat: the smoke test granted `select, insert, update, delete` on all tables to `anon` and `authenticated` to make the RLS checks run. The migration itself only grants the narrower set in `DATABASE_SCHEMA.md`, so direct-write restrictions were not verified by this test. Re-run these checks on the hosted project.

## Not tested

- Live Supabase Auth flows: sign up, sign in, password recovery, social login. Requires a hosted dev project.
- `npm run seed` against a real project. Requires credentials. The script's guard logic is untested.
- Storage avatar upload policies.
- Browser-level UI tests of each screen. Only a production build was checked, not a running app.
- Frontend and runtime logs against a real backend.

## Bugs found and fixed

- `npm run lint` failed: `next lint` does not work with this ESLint 8 setup. Changed to call `eslint` directly.
- `config/hooks.js` relied on array offsets to pick users (`isUserExist`). Replaced by UUIDs from Supabase Auth.
- `IconBell` loaded an external Fruitask image. Now uses a local SVG.
- Local migration initially failed because the test stub lacked the `authenticated` role. Fixed in the test environment only.

## Remaining issues

- Hosted project credentials are needed to run the auth and seed checks above.
- Dependency advisories remain for `sharp` (0.33.5) and nested `postcss`/`brace-expansion`. See [MIGRATION_REPORT.md](./MIGRATION_REPORT.md).
- Supabase Auth email redirect URLs must be configured in the dashboard (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)).
- Notifications are created only through bookings and are not realtime.
