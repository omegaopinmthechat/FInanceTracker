import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = Constants.expoConfig?.extra
  ?.expoPublicSupabaseUrl as string;
const supabaseKey = Constants.expoConfig?.extra
  ?.expoPublicSupabaseAnonKey as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is missing in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
