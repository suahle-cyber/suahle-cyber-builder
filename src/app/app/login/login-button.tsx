"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

// [Google 로 로그인] — 누르면 Google 창으로 갔다가 /app/auth/callback 으로 돌아온다 (D-05)
export function LoginButton() {
  const failed = useSearchParams().get("error") === "1"; // Google 에서 돌아오다 실패하면 ?error=1
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(failed);

  async function login() {
    setLoading(true);
    setError(false);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/app/auth/callback` },
    });
    if (error) {
      setLoading(false);
      setError(true);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p role="alert" className="text-[13px] text-destructive">
          로그인하지 못했어요. 다시 해 주세요.
        </p>
      )}
      <Button size="lg" onClick={login} disabled={loading} className="h-11 text-[15px]">
        {loading ? "로그인 중…" : "Google 로 로그인"}
      </Button>
    </div>
  );
}
