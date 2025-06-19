import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const supabaseUrl = Constants.expoConfig?.extra
  ?.expoPublicSupabaseUrl as string;
const supabaseKey = Constants.expoConfig?.extra
  ?.expoPublicSupabaseAnonKey as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is missing in environment variables.");
}
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);
