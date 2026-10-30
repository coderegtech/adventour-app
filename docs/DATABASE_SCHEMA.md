# Database Schema

Defined in `supabase/migrations/202610300001_initial.sql`.

## Tables

| Table | Purpose | Key relations |
| --- | --- | --- |
| `profiles` | Public name and avatar for each user | `id` → `auth.users` (1:1). Created by a trigger on signup |
| `categories` | Filter chips on the home page | Referenced by name from `tourist_spots.category` |
| `tourist_spots` | Destinations with base price and optional `packages` (jsonb array) | — |
| `bookings` | Trip requests | `user_id` → `auth.users`, `spot_id` → `tourist_spots` |
| `payments` | One simulated payment per booking | `booking_id` → `bookings` (unique), `user_id` |
| `bookmarks` | Saved spots | `user_id`, `spot_id`; unique pair |
| `reviews` | Ratings and messages | `user_id`, `spot_id`; one review per user per spot |
| `notifications` | In-app notifications | `user_id` |

Storage: bucket `avatars` (public read, 5 MB, jpeg/png/webp). Files live at `avatars/<user_id>/<file>`.

## Status values

- `bookings.status`: `pending`, `approved`, `completed`, `cancelled`
- `payments.status`: always `demo` (no real payment provider)
- `payments.method`: `card`, `gcash`

## Business rules enforced in the database

- `create_demo_booking(...)` (RPC) is the only way to create a booking. It:
  - Requires a signed-in user.
  - Takes the price from the spot catalog. The client cannot set the amount.
  - Validates the package name and dates.
  - Creates the booking, a demo payment, and a notification in one transaction.
  - Is idempotent on `p_request_id`. Retrying with the same ID returns the existing booking. A different user reusing the ID is rejected.
- A review can only be inserted when the user has a `completed` booking for that spot.
- A review's author name and avatar are copied from `profiles` by a trigger.
- Bookings, payments, and notifications cannot be written directly from the client.

## Row Level Security

RLS is enabled on every table.

| Table | anon | authenticated |
| --- | --- | --- |
| `categories`, `tourist_spots` | read | read |
| `reviews` | read | read; insert own review for a completed booking |
| `profiles` | — | read own; update own `name` and `avatar_url` |
| `bookings`, `payments`, `notifications` | — | read own (writes via RPC or trigger only) |
| `bookmarks` | — | read, insert, delete own |

Direct `GRANT`s are limited to the columns above, so a user cannot change `user_id`, `status`, or `amount` on other rows.

Storage policies on `storage.objects` allow each user to read, write, update, and delete only inside their own `avatars/<user_id>/` folder.

The RPC is granted to `authenticated` only. The seed script uses the service role key, which bypasses RLS.

## Indexes

- `bookings(user_id)`, `payments(user_id)`, `notifications(user_id)`, `reviews(spot_id)`.
- Unique constraints on `bookmarks(user_id, spot_id)` and `reviews(user_id, spot_id)`.
