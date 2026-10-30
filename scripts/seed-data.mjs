// Real Palawan tourist spots for development seeding.
// Fixed UUIDs make the seed repeatable (upsert by id).
// Images are freely licensed photos hosted on Wikimedia Commons (verified URLs).
// Prices are illustrative sample tour rates in PHP, not official quotes.

export const categories = [
  { id: "c0000000-0000-4000-8000-000000000001", name: "All", sort_order: 0 },
  { id: "c0000000-0000-4000-8000-000000000002", name: "Island", sort_order: 1 },
  { id: "c0000000-0000-4000-8000-000000000003", name: "Beach", sort_order: 2 },
  { id: "c0000000-0000-4000-8000-000000000004", name: "Nature", sort_order: 3 },
  { id: "c0000000-0000-4000-8000-000000000005", name: "Diving", sort_order: 4 },
  { id: "c0000000-0000-4000-8000-000000000006", name: "Heritage", sort_order: 5 },
];

// packages: when empty, the booking uses the base price.
export const spots = [
  {
    id: "5b000000-0000-4000-8000-000000000001",
    name: "El Nido - Bacuit Bay",
    address: "El Nido, Palawan",
    description:
      "Towering limestone cliffs, hidden lagoons and white-sand beaches. The famous island-hopping tours (A, B, C and D) explore the Big and Small Lagoons, Secret Beach and Shimizu Island.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/El_Nido_Bay_December_2018.jpg",
    category: "Island",
    price: 1400,
    rating: 4.8,
    packages: [
      { name: "Tour A - Lagoons & Beaches", price: 1400 },
      { name: "Tour C - Hidden & Secret Beach", price: 1600 },
      { name: "Private Island Hopping", price: 6000 },
    ],
    latitude: 11.1949,
    longitude: 119.4013,
  },
  {
    id: "5b000000-0000-4000-8000-000000000002",
    name: "Puerto Princesa Underground River",
    address: "Puerto Princesa, Palawan",
    description:
      "A UNESCO World Heritage Site and one of the New 7 Wonders of Nature. Paddle through an 8.2 km navigable underground river that winds beneath a limestone karst mountain landscape.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Puerto-Princesa_Subterranean_River_National_Park-112012.jpg",
    category: "Nature",
    price: 1800,
    rating: 4.7,
    packages: [
      { name: "Day Tour with Permit", price: 1800 },
      { name: "Day Tour with Lunch & Transfer", price: 2500 },
    ],
    latitude: 10.1949,
    longitude: 118.9255,
  },
  {
    id: "5b000000-0000-4000-8000-000000000003",
    name: "Coron Island & Kayangan Lake",
    address: "Coron, Palawan",
    description:
      "Kayangan Lake is often called the cleanest lake in the Philippines, ringed by dramatic karst cliffs. Coron is also world famous for WWII shipwreck diving.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/8b/Coron_skyline_Tapyas_%28Coron%2C_Palwan%3B_03-16-2024%29.jpg",
    category: "Island",
    price: 1500,
    rating: 4.8,
    packages: [
      { name: "Coron Ultimate Tour", price: 1500 },
      { name: "Reefs & Wrecks Tour", price: 1700 },
    ],
    latitude: 11.9983,
    longitude: 120.2042,
  },
  {
    id: "5b000000-0000-4000-8000-000000000004",
    name: "Nacpan Beach",
    address: "Barangay Nacpan, El Nido, Palawan",
    description:
      "A four-kilometer stretch of golden sand and clear water, quieter than the town beaches. Great for swimming, sunset watching and fresh coconuts.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Nacpan_Beach_in_El_Nido.jpg",
    category: "Beach",
    price: 700,
    rating: 4.6,
    packages: [],
    latitude: 11.2825,
    longitude: 119.4219,
  },
  {
    id: "5b000000-0000-4000-8000-000000000005",
    name: "Honda Bay Island Hopping",
    address: "Honda Bay, Puerto Princesa, Palawan",
    description:
      "An easy day trip from Puerto Princesa city visiting Luli, Cowrie and Starfish islands. Shallow reefs make it ideal for snorkeling and families.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Honda_Bay%2C_Palawan.jpg",
    category: "Beach",
    price: 1200,
    rating: 4.4,
    packages: [
      { name: "3-Island Joiner Tour", price: 1200 },
      { name: "Private Boat (up to 6)", price: 4500 },
    ],
    latitude: 9.8667,
    longitude: 118.7667,
  },
  {
    id: "5b000000-0000-4000-8000-000000000006",
    name: "Barracuda Lake",
    address: "Coron Island, Palawan",
    description:
      "A thermocline dive site where cool and warm water layers meet, surrounded by limestone walls. A unique experience for divers and freedivers.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/c/c8/Barracuda_Lake_%28Coron%2C_Palawan%3B_03-17-2024%29.jpg",
    category: "Diving",
    price: 2200,
    rating: 4.7,
    packages: [
      { name: "Discover Diving (beginner)", price: 2200 },
      { name: "2 Fun Dives (certified)", price: 3200 },
    ],
    latitude: 11.9897,
    longitude: 120.2103,
  },
  {
    id: "5b000000-0000-4000-8000-000000000007",
    name: "Twin Lagoon",
    address: "Coron, Palawan",
    description:
      "Two lagoons separated by a limestone wall, connected by a small opening you swim or duck under at low tide. The emerald water and sheer cliffs are a Coron highlight.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/8/82/Twin_Lagoon_Coron_Palawan.jpg",
    category: "Island",
    price: 1600,
    rating: 4.7,
    packages: [{ name: "Twin Lagoon Day Tour", price: 1600 }],
    latitude: 12.0167,
    longitude: 120.2047,
  },
  {
    id: "5b000000-0000-4000-8000-000000000008",
    name: "Immaculate Conception Cathedral",
    address: "Rizal Avenue, Puerto Princesa, Palawan",
    description:
      "Puerto Princesa's landmark blue-and-white cathedral in the city center, beside the historic Plaza Cuartel WWII memorial. A short, easy heritage stop on a city tour.",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/e/e9/Immaculate_Conception_Cathedral_-_Puerto_Princesa_City.jpg",
    category: "Heritage",
    price: 500,
    rating: 4.2,
    packages: [
      { name: "City Heritage Walking Tour", price: 500 },
      { name: "City Tour with Guide & Van", price: 1300 },
    ],
    latitude: 9.7392,
    longitude: 118.7353,
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
    package_name: "Tour A - Lagoons & Beaches",
    full_name: "Ana Cruz",
    age: 29,
    email: "traveler@adventour.test",
    contact_number: "09171234567",
    start_date: "2026-11-05",
    end_date: "2026-11-05",
    amount: 1400,
    status: "completed",
  },
  {
    id: "b0000000-0000-4000-8000-000000000002",
    userKey: "traveler",
    spot_id: "5b000000-0000-4000-8000-000000000003",
    package_name: "Coron Ultimate Tour",
    full_name: "Ana Cruz",
    age: 29,
    email: "traveler@adventour.test",
    contact_number: "09171234567",
    start_date: "2026-12-20",
    end_date: "2026-12-21",
    amount: 1500,
    status: "approved",
  },
  {
    id: "b0000000-0000-4000-8000-000000000003",
    userKey: "traveler2",
    spot_id: "5b000000-0000-4000-8000-000000000004",
    package_name: null,
    full_name: "Ben Santos",
    age: 34,
    email: "traveler2@adventour.test",
    contact_number: "09189876543",
    start_date: "2026-11-15",
    end_date: "2026-11-17",
    amount: 700,
    status: "pending",
  },
  {
    id: "b0000000-0000-4000-8000-000000000004",
    userKey: "traveler2",
    spot_id: "5b000000-0000-4000-8000-000000000005",
    package_name: "3-Island Joiner Tour",
    full_name: "Ben Santos",
    age: 34,
    email: "traveler2@adventour.test",
    contact_number: "09189876543",
    start_date: "2026-10-01",
    end_date: "2026-10-02",
    amount: 1200,
    status: "cancelled",
  },
  // Edge case: long name and a 15-digit contact number (upper validation bounds).
  {
    id: "b0000000-0000-4000-8000-000000000005",
    userKey: "admin",
    spot_id: "5b000000-0000-4000-8000-000000000001",
    package_name: "Private Island Hopping",
    full_name: "Maria Consolacion Dela Cruz-Villanueva Fernandez de la Torre",
    age: 120,
    email: "admin@adventour.test",
    contact_number: "123456789012345",
    start_date: "2026-11-10",
    end_date: "2026-11-11",
    amount: 6000,
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
