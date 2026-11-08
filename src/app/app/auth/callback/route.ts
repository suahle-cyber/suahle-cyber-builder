import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google 로그인 후 돌아오는 곳. 받은 일회용 코드를 로그인 쿠키로 바꾸고 홈으로 보낸다.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/app", request.url));
  }
  return NextResponse.redirect(new URL("/app/login?error=1", request.url));
}
