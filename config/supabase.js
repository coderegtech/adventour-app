import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

// Keep static builds usable before a development project is configured.
export const supabase = isSupabaseConfigured ? createClient(url, key) : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.");
  }
  return supabase;
}
