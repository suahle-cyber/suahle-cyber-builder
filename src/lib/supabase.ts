import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 다음 주 기능(신청 저장 · 로그인)에서 쓴다. 값이 없으면 null.
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
