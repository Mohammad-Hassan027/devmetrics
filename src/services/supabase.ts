import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Minimal database type to avoid `any`. For full safety, generate types
// using `supabase gen types typescript --project ...` and replace Database.

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY missing");
}

import type { Database } from "../types/supabase";

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl ?? "",
  supabaseKey ?? "",
  {
    auth: { persistSession: true, detectSessionInUrl: true },
  },
);

export default supabase;
