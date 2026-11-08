import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

// 브라우저에서 쓰는 Supabase (로그인 버튼 · 로그아웃). 공개해도 되는 값만 쓴다.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
