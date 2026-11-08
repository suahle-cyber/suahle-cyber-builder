import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "가설 — Interview clip" };

export default function Page() {
  return <ComingSoon title="가설" body='"누가 왜 돈을 낼지" 가설을 적고, 근거 문장이 충분한지 보는 화면이에요.' task="T-05" />;
}
