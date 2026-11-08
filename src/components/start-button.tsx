import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 랜딩 [써 보기] → 제품 화면 /app (T-02). 로그인 안 한 사람을 로그인 화면으로 보내는 것은 T-03 에서.
export function StartButton({ className }: { className?: string }) {
  return (
    <Button asChild size="lg" className={cn("h-12 px-7 text-base font-semibold", className)}>
      <Link href="/app">
        써 보기
        <ArrowRight data-icon="inline-end" strokeWidth={1.5} />
      </Link>
    </Button>
  );
}
