import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "인터뷰 넣기 — Interview clip" };

export default function Page() {
  return <ComingSoon title="인터뷰 넣기" body='고객과 날짜를 고르고 인터뷰 기록을 붙여넣거나 .txt 파일로 올리는 화면이에요.' task="T-07" />;
}
