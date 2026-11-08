import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "고객 목록 — Interview clip" };

export default function Page() {
  return <ComingSoon title="고객" body='인터뷰한 고객을 별칭 · 회사 · 메모로 모아 보고, 검색으로 찾는 화면이에요.' task="T-06" />;
}
