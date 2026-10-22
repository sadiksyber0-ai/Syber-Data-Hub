
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Replace these two values with the details from your SYBER DATA HUB project.
const SUPABASE_URL = "https://dtywzvoninkuvcfdcjom.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_LQo0idKl0hKVeuD5q5WWYA_mEnPJyul";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
