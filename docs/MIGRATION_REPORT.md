# Migration Report

Branch: `feature/supabase-migration`

## Summary

The app moved from two external services to Supabase:

- **Fruitask** (REST tables for spots, users, bookings, reviews, bookmarks, notifications, categories, payments). Its hard-coded API keys are removed.
- **Firebase** (client authentication). Replaced by Supabase Auth.

## Removed

- `config/API.js` (Fruitask endpoints and API key).
- `config/axios.js`.
- `config/firebase_config.js`.
- `firebase`, `axios` dependencies from `package.json`.
- Firebase Hosting boilerplate in `public/` (`index.html`, `404.html`).
- External Fruitask icon URL in `components/Icons.jsx`. Replaced by `public/svg/bell.svg`.

## Added

- `config/supabase.js`: one shared client. Exports `supabase`, `isSupabaseConfigured`, and `requireSupabase()`.
- `supabase/` with `config.toml`, initial migration.
- `app/reset_password/page.js`: password reset page for recovery links.
- `scripts/seed.mjs`, `scripts/seed-data.mjs`: guarded mock-data seeding.
- `tests/seed-data.test.mjs`: integrity tests for seed data.
- `.env.example`.
- `docs/` (this report and the other documentation).
- npm scripts: `test`, `seed`. `lint` now runs eslint directly.

## Changed

- `config/hooks.js`: same exported function names, rewritten to query Supabase. Returns `{ success, data }`. Booking creation goes through the `create_demo_booking` RPC so prices are server-side.
- `context/authContext.js`: Supabase session listener. Handles profile loading, recovery mode, and redirects.
- `app/login`, `app/signup`, `app/forgot_password`, `app/edit_profile`, `app/profile`, `components/SocialAuth.jsx`, `components/Profile.jsx`: use Supabase Auth and `profiles`.
- Data screens and components switched to UUID ids instead of array offsets (the Fruitask ids were offsets in some code paths).
- `.gitignore`: allows `.env.example`, ignores `supabase/.temp`.
- `package.json`: `lint` script fixed for ESLint 8 (`next lint` was failing on this setup).

## Behavior changes users will notice

- Payments are **simulated**. A booking creates a `demo` payment row. No money moves and no provider is called. The notification says so.
- Users must have a `completed` booking before reviewing a spot.
- Booking dates must be today or later.
- Review author name and avatar are stored at review time.

## Business logic preserved

- Browsing spots, categories, search, map, and popular/top places.
- Bookmarks (add, remove, list).
- Booking form with packages, booking history, and booking detail.
- Notifications list.
- Reviews and ratings per spot.
- Profile view and edit (name and avatar).

## Security fixes made during migration

- Removed the hard-coded Fruitask API key from the source.
- Clients can no longer write `status`, `amount`, or other users' rows directly.
- Booking amounts are computed in the database.
- Service role key is only read by the seed script and must never use a `NEXT_PUBLIC_` prefix.

## Dependency security

`npm audit fix` (non-breaking) was applied. Remaining findings need breaking upgrades:

- `next` was upgraded 15.0.2 → 15.5.28 by the non-breaking fix (this cleared the critical advisory). A nested `postcss` inside `next` still reports a high advisory.
- `sharp` stays at 0.33.5. Its fix needs the breaking 0.35 upgrade (libvips advisories). Not applied.
- `brace-expansion` (high, transitive, dev tooling): needs `npm audit fix --force`, not applied.

These were not upgraded in this change to keep the migration scope focused. See [TEST_RESULTS.md](./TEST_RESULTS.md).
