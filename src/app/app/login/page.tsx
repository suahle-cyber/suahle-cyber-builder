import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginButton } from "./login-button";

export const metadata: Metadata = {
  title: "로그인 — Interview clip",
};

// 로그인 (FLOW.md /app/login, DESIGN.md 6) — 가운데 좁은 한 줄, 색 거의 없음
export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8 px-4 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Interview clip</h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          고객 인터뷰를 고객별로 쌓고, 누구에게 언제 다시 연락해 무엇을 물을지 알려 드려요.
        </p>
      </div>
      <div className="flex flex-col gap-3 border-t pt-6">
        <Suspense fallback={<div className="h-11 animate-pulse rounded-lg bg-muted" />}>
          <LoginButton />
        </Suspense>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          내 기록은 나만 봐요. 다른 사용자는 볼 수 없어요.
        </p>
      </div>
      <Link
        href="/"
        className="text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        ← 소개 페이지로 돌아가기
      </Link>
    </main>
  );
}
