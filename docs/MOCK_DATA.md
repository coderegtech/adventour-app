# Mock Data

Seed data lives in `scripts/seed-data.mjs`. The seed script is `scripts/seed.mjs`. Both run against a **development** Supabase project only.

The tourist spots are real destinations in Palawan, Philippines.

## What gets seeded

| Entity | Count | Notes |
| --- | --- | --- |
| Auth users | 3 | Created through the Auth API |
| Categories | 6 | All, Island, Beach, Nature, Diving, Heritage |
| Tourist spots | 8 | Real Palawan spots; two use base price only, the rest have packages |
| Bookings | 5 | Covers pending, approved, completed, cancelled |
| Payments | 5 | One demo payment per booking |

### Tourist spots

El Nido - Bacuit Bay, Puerto Princesa Underground River, Coron Island & Kayangan Lake, Nacpan Beach, Honda Bay Island Hopping, Barracuda Lake, Twin Lagoon, Immaculate Conception Cathedral.

Prices are illustrative sample tour rates in PHP, not official quotes.

### Images

Spot images are freely licensed photos hosted on Wikimedia Commons. Each `image_url` is a verified `upload.wikimedia.org` link resolved through the Commons API. No images are copied into the repository.

Edge cases included: a very long name, a 15-digit contact number, age 120, and a high-value package booking.

## Demo accounts

| Email | Name | Bookings |
| --- | --- | --- |
| `traveler@adventour.test` | Ana Cruz | completed, approved |
| `traveler2@adventour.test` | Ben Santos | pending, cancelled |
| `admin@adventour.test` | Carla Reyes | pending |

The password is the `SEED_USER_PASSWORD` value from `.env.local`. It is never stored in the repository.

## Running the seed

1. Set the variables in `.env.local` (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)). Set `SEED_CONFIRM_DEVELOPMENT=yes` only for a dev project.
2. Run:

```bash
npm run seed
```

The script refuses to run when:

- `NEXT_PUBLIC_SUPABASE_URL` differs from `SEED_ALLOWED_URL`.
- `SEED_CONFIRM_DEVELOPMENT` is not `yes`.
- `SEED_USER_PASSWORD` is missing or shorter than 12 characters.

It is idempotent. Fixed UUIDs mean re-running upserts the same rows, and existing auth users are reused.

## Checking the seed data

```bash
npm test
```

The tests check foreign keys, booking amounts against the price rules, payment amounts, lifecycle coverage, and database check limits. They run without network access.

## Resetting

Do not reset production. For a dev project, delete the demo rows in the SQL editor, then run `npm run seed` again.
