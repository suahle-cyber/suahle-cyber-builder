"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { House, Lightbulb, LogOut, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// 공통 메뉴 (T-04, FLOW.md · DESIGN.md 6) — 노트북은 위 띠, 휴대폰은 아래 고정 띠
const menu = [
  { name: "홈", href: "/app", icon: House },
  { name: "고객", href: "/app/customers", icon: Users },
  { name: "가설", href: "/app/hypotheses", icon: Lightbulb },
] as const;
const NEW_INTERVIEW = "/app/interviews/new";

function isCurrent(path: string, href: string) {
  return href === "/app" ? path === "/app" : path === href || path.startsWith(href + "/");
}

export function AppHeader() {
  const path = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  async function logout() {
    setLeaving(true);
    await createClient().auth.signOut();
    router.replace("/app/login");
    router.refresh();
  }

  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-4 md:px-8">
          <Link href="/app" className="font-serif text-lg font-semibold">
            Interview clip
          </Link>
          <nav aria-label="메뉴" className="hidden items-center gap-5 text-sm md:flex">
            {menu.map((m) => {
              const on = isCurrent(path, m.href);
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "border-b py-1 transition-colors",
                    on
                      ? "border-foreground font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m.name}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild size="lg" className="hidden px-3 md:inline-flex">
              <Link href={NEW_INTERVIEW}>
                <Plus data-icon="inline-start" strokeWidth={1.5} />
                인터뷰 넣기
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={logout}
              disabled={leaving}
              className="text-muted-foreground"
            >
              <LogOut data-icon="inline-start" strokeWidth={1.5} />
              <span className="hidden md:inline">로그아웃</span>
              <span className="sr-only md:hidden">로그아웃</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 휴대폰: 아래 고정 메뉴 */}
      <nav
        aria-label="메뉴"
        className="fixed inset-x-0 bottom-0 z-10 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="grid h-16 grid-cols-4">
          {menu.map((m) => {
            const on = isCurrent(path, m.href);
            return (
              <Link
                key={m.href}
                href={m.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-xs",
                  on ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                <m.icon className="size-5" strokeWidth={1.5} />
                {m.name}
              </Link>
            );
          })}
          <Link
            href={NEW_INTERVIEW}
            aria-current={isCurrent(path, NEW_INTERVIEW) ? "page" : undefined}
            className="flex flex-col items-center justify-center gap-1 text-xs font-semibold text-clay"
          >
            <Plus className="size-5" strokeWidth={1.5} />
            인터뷰 넣기
          </Link>
        </div>
      </nav>
    </>
  );
}
