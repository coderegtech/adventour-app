// Seeds mock data into a DEVELOPMENT Supabase project only.
// Run with: npm run seed
// Requires SUPABASE_SERVICE_ROLE_KEY and the safety variables in .env.example.
import { createClient } from "@supabase/supabase-js";
import { categories, spots, users, bookings, payments } from "./seed-data.mjs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const allowedUrl = process.env.SEED_ALLOWED_URL;
const password = process.env.SEED_USER_PASSWORD;

// Safety checks: stop before touching anything that is not clearly a dev project.
function checkSafety() {
  if (!url || !serviceKey || !allowedUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or SEED_ALLOWED_URL.");
  }
  if (url !== allowedUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL does not match SEED_ALLOWED_URL. Refusing to seed.");
  }
  if (process.env.SEED_CONFIRM_DEVELOPMENT !== "yes") {
    throw new Error("Set SEED_CONFIRM_DEVELOPMENT=yes to confirm this is a development project.");
  }
  if (!password || password.length < 12) {
    throw new Error("Set SEED_USER_PASSWORD to a password with at least 12 characters.");
  }
}

// Creates the auth user through the Auth API (never inserts into auth tables directly).
// If the user already exists, we reuse it so the seed can run again.
async function createOrFindUser(admin, user) {
  const { data, error } = await admin.auth.admin.createUser({
    email: user.email,
    password,
    email_confirm: true,
    user_metadata: { name: user.name },
  });
  if (!error) return data.user.id;

  const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const existing = list.users.find((item) => item.email === user.email);
  if (!existing) throw error;
  return existing.id;
}

async function run() {
  checkSafety();
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Users first, so profile rows and bookings can reference them.
  const userIds = {};
  for (const user of users) {
    userIds[user.key] = await createOrFindUser(admin, user);
    console.log("User ready:", user.email);
  }

  await check(admin.from("categories").upsert(categories, { onConflict: "id" }));
  await check(admin.from("tourist_spots").upsert(spots, { onConflict: "id" }));

  // Seed data refers to users by a short key, so swap in the real auth user id here.
  const bookingRows = bookings.map(({ userKey, ...row }) => ({ ...row, user_id: userIds[userKey] }));
  await check(admin.from("bookings").upsert(bookingRows, { onConflict: "id" }));

  const paymentRows = payments.map(({ userKey, ...row }) => ({ ...row, user_id: userIds[userKey] }));
  await check(admin.from("payments").upsert(paymentRows, { onConflict: "id" }));

  console.log(
    `Seeded ${categories.length} categories, ${spots.length} spots, ${bookingRows.length} bookings, ${users.length} users.`
  );
}

async function check(promise) {
  const { error } = await promise;
  if (error) throw error;
}

run().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
});
