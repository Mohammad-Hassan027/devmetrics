import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.warn("VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is not set");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
