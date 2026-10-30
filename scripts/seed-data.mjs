// Mock data for development. Fixed UUIDs make the seed repeatable (upsert by id).

export const categories = [
  { id: "c0000000-0000-4000-8000-000000000001", name: "All", sort_order: 0 },
  { id: "c0000000-0000-4000-8000-000000000002", name: "Beach", sort_order: 1 },
  { id: "c0000000-0000-4000-8000-000000000003", name: "Mountain", sort_order: 2 },
  { id: "c0000000-0000-4000-8000-000000000004", name: "Heritage", sort_order: 3 },
  { id: "c0000000-0000-4000-8000-000000000005", name: "City", sort_order: 4 },
];

// packages: when empty, the booking uses the base price.
export const spots = [
  {
    id: "5b000000-0000-4000-8000-000000000001",
    name: "Crystal Cove Beach",
    address: "Sample Coast Road, Demo Province",
    description: "White sand, calm water and sunset cruises.",
    image_url: "https://images.example.com/mock/crystal-cove.jpg",
    category: "Beach",
    price: 1500,
    rating: 4.6,
    packages: [
      { name: "Day Trip", price: 1500 },
      { name: "Two-Day Stay", price: 3200 },
    ],
    latitude: 10.3157,
    longitude: 123.8854,
  },
  {
    id: "5b000000-0000-4000-8000-000000000002",
    name: "Misty Pine Ridge",
    address: "Highland Trail, Demo Province",
    description: "Cool morning hikes and a lookout over the valley.",
    image_url: "https://images.example.com/mock/misty-pine.jpg",
    category: "Mountain",
    price: 900,
    rating: 4.3,
    packages: [],
    latitude: 16.4023,
    longitude: 120.5960,
  },
  {
    id: "5b000000-0000-4000-8000-000000000003",
    name: "Old Town Heritage Walk",
    address: "Plaza District, Demo City",
    description: "Cobblestone streets, ancestral houses and local food.",
    image_url: "https://images.example.com/mock/old-town.jpg",
    category: "Heritage",
    price: 600,
    rating: 4.8,
    packages: [{ name: "Guided Tour", price: 600 }, { name: "Tour with Dinner", price: 1100 }],
    latitude: 10.6920,
    longitude: 122.5644,
  },
  {
    id: "5b000000-0000-4000-8000-000000000004",
    name: "Metro Skyline Deck",
    address: "Downtown Avenue, Demo City",
    description: "City lights and rooftop bars.",
    image_url: "https://images.example.com/mock/skyline.jpg",
    category: "City",
    price: 350,
    rating: 3.9,
    packages: [],
    latitude: 14.5995,
    longitude: 120.9842,
  },
];

// Demo accounts. Passwords come from SEED_USER_PASSWORD, never from this file.
export const users = [
  { key: "traveler", email: "traveler@adventour.test", name: "Ana Cruz" },
  { key: "traveler2", email: "traveler2@adventour.test", name: "Ben Santos" },
  { key: "admin", email: "admin@adventour.test", name: "Carla Reyes" },
];

// Lifecycle states: pending, approved, completed, cancelled.
// `amount` is set to the package/base price so it matches the server-side rule.
export const bookings = [
  {
    id: "b0000000-0000-4000-8000-000000000001",
    userKey: "traveler",
    spot_id: "5b000000-0000-4000-8000-000000000001",
    package_name: "Day Trip",
    full_name: "Ana Cruz",
    age: 29,
    email: "traveler@adventour.test",
    contact_number: "09171234567",
    start_date: "2026-11-05",
    end_date: "2026-11-05",
    amount: 1500,
    status: "completed",
  },
  {
    id: "b0000000-0000-4000-8000-000000000002",
    userKey: "traveler",
    spot_id: "5b000000-0000-4000-8000-000000000003",
    package_name: "Guided Tour",
    full_name: "Ana Cruz",
    age: 29,
    email: "traveler@adventour.test",
    contact_number: "09171234567",
    start_date: "2026-12-20",
    end_date: "2026-12-21",
    amount: 600,
    status: "approved",
  },
  {
    id: "b0000000-0000-4000-8000-000000000003",
    userKey: "traveler2",
    spot_id: "5b000000-0000-4000-8000-000000000002",
    package_name: null,
    full_name: "Ben Santos",
    age: 34,
    email: "traveler2@adventour.test",
    contact_number: "09189876543",
    start_date: "2026-11-15",
    end_date: "2026-11-17",
    amount: 900,
    status: "pending",
  },
  {
    id: "b0000000-0000-4000-8000-000000000004",
    userKey: "traveler2",
    spot_id: "5b000000-0000-4000-8000-000000000004",
    package_name: null,
    full_name: "Ben Santos",
    age: 34,
    email: "traveler2@adventour.test",
    contact_number: "09189876543",
    start_date: "2026-10-01",
    end_date: "2026-10-02",
    amount: 350,
    status: "cancelled",
  },
  // Edge case: long name and a 15-digit contact number (upper validation bounds).
  {
    id: "b0000000-0000-4000-8000-000000000005",
    userKey: "admin",
    spot_id: "5b000000-0000-4000-8000-000000000001",
    package_name: "Two-Day Stay",
    full_name: "Maria Consolacion Dela Cruz-Villanueva Fernandez de la Torre",
    age: 120,
    email: "admin@adventour.test",
    contact_number: "123456789012345",
    start_date: "2026-11-10",
    end_date: "2026-11-11",
    amount: 3200,
    status: "pending",
  },
];

// One demo payment per booking. Status is always 'demo' (no real charges).
export const payments = bookings.map((booking) => ({
  id: booking.id.replace(/^b/, "9"),
  booking_id: booking.id,
  userKey: booking.userKey,
  amount: booking.amount,
  method: booking.id.endsWith("2") ? "gcash" : "card",
  status: "demo",
}));
