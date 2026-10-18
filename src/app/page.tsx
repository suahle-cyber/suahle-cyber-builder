import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-xl font-semibold">랜딩 페이지 — 곧 열립니다</p>
          <p className="text-sm text-muted-foreground">AI 프로덕트 빌더 클럽 3기</p>
        </CardContent>
      </Card>
    </main>
  );
}
