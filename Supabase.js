
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Replace these two values with the details from your SYBER DATA HUB project.
const SUPABASE_URL = "https://tmvckzbusqxtvsujmbpw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_PDNAYUI9tYirQoE4gl5www_fqY5A2wa";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
