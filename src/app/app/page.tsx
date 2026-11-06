import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { getExampleHome } from "./example-home";
import { AppHeader, HomeBoard } from "./home-board";

export const metadata: Metadata = {
  title: "다시 연락할 사람 — VOC tracker",
};

// 홈 — 다시 연락할 사람 (FLOW.md ★, DESIGN.md 6). 4단계에서는 연습용 예시 데이터로만 보여 준다.
export default function AppHome() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-8 pb-28 md:px-8 md:pt-14 md:pb-20">
        <Suspense fallback={<HomeSkeleton />}>
          <HomeContent />
        </Suspense>
      </main>
    </>
  );
}

async function HomeContent() {
  await connection(); // '오늘'이 매번 바뀌므로 요청 때마다 날짜를 계산
  return <HomeBoard data={getExampleHome()} />;
}

// 불러오는 중 — 글자 줄 모양 회색 자리표시 (DESIGN.md 5)
function HomeSkeleton() {
  const bar = "animate-pulse rounded-sm bg-muted";
  return (
    <div className="flex flex-col gap-12" aria-busy="true" aria-label="불러오는 중">
      <div className="flex flex-col gap-3">
        <div className={`${bar} h-5 w-20`} />
        <div className={`${bar} h-8 w-48`} />
        <div className={`${bar} h-4 w-72 max-w-full`} />
      </div>
      <div className={`${bar} h-20 w-full`} />
      <div className="flex flex-col gap-3 border-t pt-6">
        <div className={`${bar} h-5 w-40`} />
        <div className={`${bar} h-4 w-full`} />
        <div className={`${bar} h-4 w-5/6`} />
      </div>
    </div>
  );
}
