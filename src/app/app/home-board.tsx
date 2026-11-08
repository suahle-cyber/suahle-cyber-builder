"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  ChevronDown,
  House,
  Lightbulb,
  LogOut,
  Plus,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { HomeData, OpenFollowup, PastFollowup } from "./example-home";

const notYet = () => toast("연습용 예시예요. 이 기능은 5단계(만들기)에서 연결돼요.");

// ── 날짜 도우미 (한국 날짜 문자열 YYYY-MM-DD) ──
function md(date: string) {
  const [, m, d] = date.split("-").map(Number);
  return `${m}월 ${d}일`;
}
function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
}

// 꼬리표 — 작은 글씨, 자간 넓게 (DESIGN.md 4)
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("text-xs font-medium tracking-[0.04em] text-muted-foreground", className)}>
      {children}
    </span>
  );
}

// ── 공통 메뉴 (T-04 미리보기: 노트북은 위, 휴대폰은 아래) ──
const menu = [
  { name: "홈", icon: House, current: true },
  { name: "고객", icon: Users, current: false },
  { name: "가설", icon: Lightbulb, current: false },
];

export function AppHeader() {
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
          <span className="font-serif text-lg font-semibold">Interview clip</span>
          <nav className="hidden items-center gap-5 text-sm md:flex">
            {menu.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={m.current ? undefined : notYet}
                aria-current={m.current ? "page" : undefined}
                className={cn(
                  "py-1 transition-colors",
                  m.current
                    ? "border-b border-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m.name}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button size="lg" onClick={notYet} className="hidden px-3 md:inline-flex">
              <Plus data-icon="inline-start" strokeWidth={1.5} />
              인터뷰 넣기
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
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t bg-background md:hidden">
        <div className="grid h-16 grid-cols-4">
          {menu.map((m) => (
            <button
              key={m.name}
              type="button"
              onClick={m.current ? undefined : notYet}
              aria-current={m.current ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs",
                m.current ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              <m.icon className="size-5" strokeWidth={1.5} />
              {m.name}
            </button>
          ))}
          <button
            type="button"
            onClick={notYet}
            className="flex flex-col items-center justify-center gap-1 text-xs font-semibold text-clay"
          >
            <Plus className="size-5" strokeWidth={1.5} />
            인터뷰 넣기
          </button>
        </div>
      </nav>
    </>
  );
}

// ── 홈 본문 ──
export function HomeBoard({ data }: { data: HomeData }) {
  const [open, setOpen] = useState<OpenFollowup[]>(data.open);
  const [past, setPast] = useState<PastFollowup[]>(data.past);

  const all = [...open, ...past];
  const within7 = past.filter(
    (p) => p.status === "contacted" && daysBetween(p.recommendedOn, p.doneOn) <= 7,
  ).length;
  const rate = all.length ? Math.round((within7 / all.length) * 100) : 0;

  function finish(f: OpenFollowup, status: PastFollowup["status"]) {
    setOpen((xs) => xs.filter((x) => x.id !== f.id));
    setPast((xs) => [
      {
        id: f.id,
        customerAlias: f.customerAlias,
        company: f.company,
        recommendedOn: f.recommendedOn,
        status,
        doneOn: data.today,
        question: f.question,
      },
      ...xs,
    ]);
    toast(
      status === "contacted"
        ? `${f.customerAlias} — 연락함으로 남겼어요 (연습용 예시라 새로고침하면 돌아가요)`
        : `${f.customerAlias} — 건너뛰었어요 (연습용 예시)`,
    );
  }

  return (
    <div className="flex flex-col gap-12 md:gap-14">
      {/* 제목 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="outline"
            className="rounded-sm border-dashed border-muted-foreground/50 text-muted-foreground"
          >
            연습용 예시
          </Badge>
          <Button variant="link" size="sm" onClick={notYet} className="px-0 text-muted-foreground">
            예시 지우기
          </Button>
        </div>
        <h1 className="font-serif text-2xl leading-snug font-semibold md:text-[1.75rem]">
          다시 연락할 사람
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          근거가 부족한 가설을 채워 줄 고객이에요. 연락한 뒤 [연락함]을 눌러 주세요.
        </p>
      </section>

      {/* 요약 한 줄 */}
      <section aria-label="요약" className="grid grid-cols-3 border-y">
        <Stat label="추천" value={`${all.length}건`} />
        <Stat label="7일 안 연락" value={`${within7}건`} className="border-l" />
        <Stat label="연락 비율" value={`${rate}%`} className="border-l" tone="moss" />
      </section>

      {/* 분석 전 알림 */}
      {data.pendingInterviews.length > 0 && (
        <div className="-mt-6 flex flex-col gap-2 rounded-md bg-muted px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between md:-mt-8">
          <span>
            <span className="mr-2 inline-block size-1.5 translate-y-[-2px] rounded-full bg-clay" />
            분석 전 인터뷰 {data.pendingInterviews.length}개 —{" "}
            {data.pendingInterviews
              .map((p) => `${p.customerAlias} · ${md(p.interviewDate)}`)
              .join(", ")}
          </span>
          <Button variant="link" size="sm" onClick={notYet} className="h-auto self-start px-0 sm:self-auto">
            분석하러 가기
            <ArrowRight data-icon="inline-end" strokeWidth={1.5} />
          </Button>
        </div>
      )}

      {/* 지금 연락할 사람 */}
      <section className="flex flex-col">
        <SectionTitle title="지금 연락할 사람" count={open.length} />
        {open.length === 0 ? (
          <p className="py-10 text-[15px] leading-relaxed text-muted-foreground">
            지금 다시 연락할 사람이 없어요. 가설을 적고 인터뷰를 넣으면 여기에 떠요.
          </p>
        ) : (
          <ol>
            {open.map((f, i) => (
              <FollowupItem
                key={f.id}
                index={i + 1}
                f={f}
                today={data.today}
                onContacted={() => finish(f, "contacted")}
                onSkipped={() => finish(f, "skipped")}
              />
            ))}
          </ol>
        )}
      </section>

      {/* 지난 추천 (접힘) */}
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between border-b pb-3 [&::-webkit-details-marker]:hidden">
          <span className="text-[15px] font-semibold">
            지난 추천 <span className="ml-1 font-normal text-muted-foreground">{past.length}</span>
          </span>
          <ChevronDown
            className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
            strokeWidth={1.5}
          />
        </summary>
        <ul>
          {past.map((p) => {
            const days = daysBetween(p.recommendedOn, p.doneOn);
            const ok = p.status === "contacted" && days <= 7;
            return (
              <li key={p.id} className="flex flex-col gap-1.5 border-b py-4 text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="font-semibold">
                    {p.customerAlias}
                    {p.company && (
                      <span className="ml-2 font-normal text-muted-foreground">{p.company}</span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      ok ? "text-moss" : "text-muted-foreground",
                    )}
                  >
                    {p.status === "contacted" ? (
                      <>
                        {ok && <Check className="size-3.5" strokeWidth={2} />}
                        {md(p.doneOn)} 연락함 · {days === 0 ? "당일" : `${days}일 만`}
                        {ok ? " · 7일 안" : ""}
                      </>
                    ) : (
                      <>{md(p.doneOn)} 건너뜀</>
                    )}
                  </span>
                </div>
                <p className="leading-relaxed text-muted-foreground">{p.question}</p>
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
}

function Stat({
  label,
  value,
  className,
  tone,
}: {
  label: string;
  value: string;
  className?: string;
  tone?: "moss";
}) {
  return (
    <div className={cn("flex flex-col gap-1 px-3 py-4 first:pl-0 md:px-5 md:first:pl-0", className)}>
      <Label>{label}</Label>
      <span
        className={cn(
          "text-2xl font-semibold tabular-nums md:text-[1.75rem]",
          tone === "moss" && "text-moss",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <h2 className="border-b border-foreground pb-3 text-[15px] font-semibold">
      {title}
      <span className="ml-1.5 font-normal text-muted-foreground">{count}</span>
    </h2>
  );
}

function FollowupItem({
  index,
  f,
  today,
  onContacted,
  onSkipped,
}: {
  index: number;
  f: OpenFollowup;
  today: string;
  onContacted: () => void;
  onSkipped: () => void;
}) {
  const [skipping, setSkipping] = useState(false);
  const days = daysBetween(f.recommendedOn, today);

  return (
    <li className="grid grid-cols-[2rem_1fr] gap-x-3 border-b py-6 md:grid-cols-[3rem_1fr] md:gap-x-4">
      <span className="pt-0.5 text-xs font-medium tracking-[0.04em] text-muted-foreground tabular-nums">
        {String(index).padStart(2, "0")}
      </span>

      <div className="flex min-w-0 flex-col gap-4">
        {/* 누구 · 언제 */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-[17px] font-semibold">
            {f.customerAlias}
            {f.company && (
              <span className="ml-2 text-[13px] font-normal text-muted-foreground">{f.company}</span>
            )}
          </h3>
          <span className="text-[13px] font-medium text-clay">
            {md(f.recommendedOn)} 추천 · {days === 0 ? "오늘" : `${days}일째`}
          </span>
        </div>

        {/* 무엇을 */}
        <div className="flex flex-col gap-1">
          <Label>물어볼 것</Label>
          <p className="text-[15px] leading-relaxed">{f.question}</p>
        </div>

        {/* 왜 */}
        <div className="flex flex-col gap-2">
          <Label>왜</Label>
          <div className="flex flex-wrap items-center gap-2 text-[15px]">
            <span>{f.hypothesis}</span>
            <Badge variant="outline" className="rounded-sm border-clay/40 text-clay">
              근거 부족
            </Badge>
          </div>
          <blockquote className="mt-1 border-l-2 border-clay pl-4">
            <p className="font-serif text-base leading-[1.7]">“{f.quote}”</p>
            <footer className="mt-1 text-[13px] text-muted-foreground">
              {f.customerAlias} · {md(f.quoteDate)} 인터뷰
            </footer>
          </blockquote>
        </div>

        {/* 버튼 */}
        {skipping ? (
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              onSkipped();
            }}
          >
            <Input
              aria-label="건너뛰는 이유 (선택)"
              placeholder="건너뛰는 이유 (선택)"
              maxLength={200}
              className="h-9 bg-card sm:flex-1"
            />
            <div className="flex gap-2">
              <Button type="submit" variant="outline" size="lg">
                건너뛰기
              </Button>
              <Button type="button" variant="ghost" size="lg" onClick={() => setSkipping(false)}>
                취소
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Button size="lg" onClick={onContacted} className="px-4">
              <Check data-icon="inline-start" strokeWidth={1.5} />
              연락함
            </Button>
            <Button variant="outline" size="lg" onClick={() => setSkipping(true)} className="px-4">
              건너뜀
            </Button>
            <Button variant="link" size="lg" onClick={notYet} className="ml-auto px-0 text-foreground">
              고객 보기
              <ArrowRight data-icon="inline-end" strokeWidth={1.5} />
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
