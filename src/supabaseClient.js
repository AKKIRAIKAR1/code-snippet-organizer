import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wclgsjbjyyqukcjhqwdl.supabase.co";
const supabaseKey = "sb_publishable_wbC0GQ0LGx4Tkb6C7NLCHA_CDXdVrGL";

export const supabase = createClient(supabaseUrl, supabaseKey);
