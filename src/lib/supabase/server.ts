import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

// 서버(화면 만들기 · 서버 기능)에서 쓰는 Supabase. 로그인 정보는 쿠키에서 읽는다.
// 공개해도 되는 값(NEXT_PUBLIC_)만 쓰고, 비밀 키는 쓰지 않는다. 표 접근은 RLS 가 막는다.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // 화면을 그리는 중에는 쿠키를 쓸 수 없다 — proxy.ts 가 대신 갱신한다.
          }
        },
      },
    },
  );
}
