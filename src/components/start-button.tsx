"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 시작하기 버튼이 갈 곳: 준비 중 → 누르면 알림만 띄운다
export function StartButton({ className }: { className?: string }) {
  return (
    <Button
      size="lg"
      className={cn("h-12 rounded-full px-7 text-base font-semibold", className)}
      onClick={() => toast("곧 열려요. 조금만 기다려 주세요!")}
    >
      곧 열려요
    </Button>
  );
}
