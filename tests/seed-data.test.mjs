import { test } from "node:test";
import assert from "node:assert/strict";
import { categories, spots, users, bookings, payments } from "../scripts/seed-data.mjs";

// Returns the price the server would charge for this booking.
function expectedAmount(booking) {
  const spot = spots.find((item) => item.id === booking.spot_id);
  if (spot.packages.length === 0) return spot.price;
  return spot.packages.find((pack) => pack.name === booking.package_name).price;
}

test("every booking points to a real spot and user", () => {
  const userKeys = users.map((user) => user.key);
  for (const booking of bookings) {
    assert.ok(spots.some((spot) => spot.id === booking.spot_id), `missing spot for ${booking.id}`);
    assert.ok(userKeys.includes(booking.userKey), `missing user for ${booking.id}`);
  }
});

test("booking amounts match the server-side price rule", () => {
  for (const booking of bookings) {
    assert.equal(booking.amount, expectedAmount(booking), `wrong amount for ${booking.id}`);
  }
});

test("every booking has one demo payment with matching amount", () => {
  assert.equal(payments.length, bookings.length);
  for (const booking of bookings) {
    const payment = payments.find((item) => item.booking_id === booking.id);
    assert.ok(payment, `missing payment for ${booking.id}`);
    assert.equal(payment.amount, booking.amount);
    assert.equal(payment.status, "demo");
  }
});

test("bookings cover every lifecycle status", () => {
  const statuses = new Set(bookings.map((booking) => booking.status));
  for (const status of ["pending", "approved", "completed", "cancelled"]) {
    assert.ok(statuses.has(status), `no ${status} booking`);
  }
});

test("dates are valid and end on or after start", () => {
  for (const booking of bookings) {
    assert.ok(booking.end_date >= booking.start_date, `bad dates for ${booking.id}`);
  }
});

test("seed ids are unique and categories cover spot categories", () => {
  const ids = [...spots, ...categories, ...bookings, ...payments].map((row) => row.id);
  assert.equal(new Set(ids).size, ids.length);

  const names = categories.map((category) => category.name);
  for (const spot of spots) {
    assert.ok(names.includes(spot.category), `unknown category ${spot.category}`);
  }
});

test("edge-case data stays inside database check limits", () => {
  for (const booking of bookings) {
    assert.match(booking.contact_number, /^[0-9]{10,15}$/);
    assert.ok(booking.full_name.trim().length >= 1 && booking.full_name.length <= 200);
    if (booking.age !== undefined) assert.ok(booking.age >= 0 && booking.age <= 120);
  }
});
