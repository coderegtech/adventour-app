# Supabase Setup

The app uses Supabase for authentication, the PostgreSQL database, and the `avatars` storage bucket.

## 1. Create a development project

Use a **dedicated development or test project**. Never point seed scripts at production.

1. Create a project at https://supabase.com.
2. In **Project Settings → API**, copy the Project URL and the `anon` public key.
3. Copy the `service_role` key too. It is only used by the seed script. Never expose it in the browser.

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

| Variable | Used by | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and seed | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser | Public anon key, protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Seed only | Bypasses RLS. Never prefix with `NEXT_PUBLIC_` |
| `SEED_ALLOWED_URL` | Seed only | Must equal `NEXT_PUBLIC_SUPABASE_URL` |
| `SEED_CONFIRM_DEVELOPMENT` | Seed only | Must be `yes` |
| `SEED_USER_PASSWORD` | Seed only | Password for demo accounts (12+ characters) |

`.env*` files are git-ignored (`.env.example` is the exception).

## 3. Apply the database migration

Link the CLI to the development project, then push the migration:

```bash
npx supabase login
npx supabase link --project-ref <your-dev-project-ref>
npx supabase db push
```

The migration lives in `supabase/migrations/202610300001_initial.sql`. It creates the tables, RLS policies, the booking RPC, and the storage bucket. See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md).

## 4. Configure Auth

In **Authentication → Providers → Email**:

- Keep email confirmation enabled. Demo seed users are created already confirmed.

In **Authentication → URL Configuration**:

- Site URL: `http://localhost:3000` for local development.
- Redirect URLs: `http://localhost:3000/home`, `http://localhost:3000/reset_password`, `http://localhost:3000/profile`.

Google and Facebook sign-in must be enabled under **Authentication → Providers** if you use the social buttons. Their client IDs and secrets are configured in the Supabase dashboard, not in this repository.

## 5. Run the app

```bash
npm install
npm run dev
```

Then seed mock data (see [MOCK_DATA.md](./MOCK_DATA.md)).

## Local Supabase (optional)

`supabase/config.toml` is included for the Supabase CLI. Running `npx supabase start` needs Docker and downloads several images. The first run can hit Docker Hub rate limits, so a hosted dev project is the simpler option.
