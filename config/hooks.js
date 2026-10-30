import { requireSupabase } from "./supabase";

const result = (data) => ({ success: true, data });
const checked = ({ data, error }) => {
  if (error) throw error;
  return data;
};
const currentUser = async () => {
  const { user } = checked(await requireSupabase().auth.getUser());
  if (!user) throw new Error("Please sign in to continue.");
  return user.id;
};
const spot = (row) => ({ ...row, imgUrl: row.image_url, categories: row.category,
  priceRange: row.price, ratings: row.rating });
const booking = (row) => ({ ...row, bookId: row.id, travelId: row.spot_id,
  userId: row.user_id, bookingPrice: row.amount, fullName: row.full_name,
  contactNumber: row.contact_number, startDate: row.start_date,
  endDate: row.end_date, package: row.package_name, datetime: row.created_at });
const bookmark = (row) => ({ ...row, travelId: row.spot_id, userId: row.user_id });
const review = (row) => ({ ...row, travelId: row.spot_id, userId: row.user_id,
  name: row.author_name, photoUrl: row.author_avatar_url, ratings: row.rating, datetime: row.created_at });

export const fetchAllTouristSpots = async () => result(
  checked(await requireSupabase().from("tourist_spots").select("*").order("name")).map(spot)
);
export const fetchAllCategories = async () => result(
  checked(await requireSupabase().from("categories").select("*").order("sort_order"))
    .map((row) => ({ ...row, category: row.name, active: row.name === "All" }))
);
export const fetchUserBookings = async () => {
  const uid = await currentUser();
  return result(checked(await requireSupabase().from("bookings").select("*").eq("user_id", uid)
    .order("created_at", { ascending: false })).map(booking));
};
export const addBooking = async (form, method = "card") => {
  const row = checked(await requireSupabase().rpc("create_demo_booking", {
    p_spot_id: form.travelId, p_package_name: form.package || null,
    p_full_name: form.fullName, p_age: form.age === "" ? null : Number(form.age),
    p_email: form.email, p_contact_number: form.contactNumber,
    p_start_date: form.startDate, p_end_date: form.endDate,
    p_method: method, p_request_id: form.requestId,
  }));
  return result(booking(row));
};
export const fetchNotifications = async () => {
  const uid = await currentUser();
  return result(checked(await requireSupabase().from("notifications").select("*").eq("user_id", uid)
    .order("created_at", { ascending: false }))
    .map((row) => ({ ...row, uid: row.user_id, text: row.body, datetime: row.created_at })));
};
export const fetchAllReviews = async (spotId) => {
  let query = requireSupabase().from("reviews").select("*").order("created_at", { ascending: false });
  if (spotId) query = query.eq("spot_id", spotId);
  return result(checked(await query).map(review));
};
export const insertReview = async (data) => {
  const uid = await currentUser();
  return result(review(checked(await requireSupabase().from("reviews").insert({
    user_id: uid, spot_id: data.travelId, message: data.message, rating: data.ratings,
  }).select().single())));
};
export const fetchBookmarks = async () => {
  const uid = await currentUser();
  return result(checked(await requireSupabase().from("bookmarks").select("*").eq("user_id", uid)).map(bookmark));
};
export const insertBookmark = async (data) => {
  const uid = await currentUser();
  const client = requireSupabase();
  const existing = checked(await client.from("bookmarks").select("*").eq("user_id", uid).eq("spot_id", data.travelId).maybeSingle());
  if (existing) return result(bookmark(existing));
  const response = await client.from("bookmarks").insert({ user_id: uid, spot_id: data.travelId }).select().single();
  if (response.error?.code === "23505") {
    return result(bookmark(checked(await client.from("bookmarks").select("*").eq("user_id", uid).eq("spot_id", data.travelId).single())));
  }
  return result(bookmark(checked(response)));
};
export const updateBookmark = async (id) => {
  const uid = await currentUser();
  checked(await requireSupabase().from("bookmarks").delete().eq("id", id).eq("user_id", uid));
  return result(null);
};
