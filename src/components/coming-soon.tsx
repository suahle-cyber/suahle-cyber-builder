import { Badge } from "@/components/ui/badge";

// 메뉴는 연결됐지만 아직 만들지 않은 화면의 자리 (T-04). 각 화면 태스크에서 바꾼다.
export function ComingSoon({ title, body, task }: { title: string; body: string; task: string }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 pt-8 pb-28 md:px-8 md:pt-14 md:pb-20">
      <Badge variant="outline" className="border-dashed text-muted-foreground">
        곧 만들어요 · {task}
      </Badge>
      <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-[28px]">{title}</h1>
      <p className="border-t pt-4 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
    </main>
  );
}
