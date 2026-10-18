import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StartButton } from "@/components/start-button";

const glass = "backdrop-blur-xl";

const pains = [
  {
    title: "판단 기준이 없어요",
    body: "PMF 를 무엇으로 판단하는지 기준이 없다.",
  },
  {
    title: "반응이 흩어져 있어요",
    body: "고객 반응이 설문 · 메모 · 대화에 흩어져 있다.",
  },
  {
    title: "결국 감으로 판단해요",
    body: "매주 직접 정리하느라 시간이 들고, 결국 감으로 판단한다.",
  },
];

const steps = [
  {
    name: "진단",
    body: "몇 가지 질문에 답하면 지금 내 제품의 PMF 단계를 알려 줘요.",
  },
  {
    name: "기록",
    body: "이번 주 설문 응답 · 인터뷰 메모를 그대로 붙여 넣어요.",
  },
  {
    name: "리포트",
    body: "PMF 신호(아쉬움 비율 · 재사용 · 추천 의향 등)를 기준에 맞춰 정리하고, 다음 주에 확인할 것을 제안해요.",
  },
];

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 flex flex-col gap-3 md:mb-14">
      <Badge variant="outline" className="text-muted-foreground">
        {eyebrow}
      </Badge>
      <h2 className="text-2xl font-bold tracking-tight md:text-4xl">{title}</h2>
    </div>
  );
}

function ExampleScreen() {
  return (
    <div className="relative">
      <p className="mb-3 text-xs font-medium text-muted-foreground">예시 화면</p>
      <Card className={`${glass} gap-0 py-0`}>
        <CardHeader className="flex items-center justify-between gap-2 border-b py-4">
          <CardTitle className="font-semibold">이번 주 PMF 리포트</CardTitle>
          <Badge variant="secondary">주간</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 py-5">
          <Card size="sm" className="bg-accent text-accent-foreground ring-0">
            <CardContent className="flex flex-col gap-1">
              <span className="text-xs font-semibold opacity-80">가장 강한 신호</span>
              <span className="text-sm font-medium">
                “없어지면 아쉽다”는 답이 어떤 고객에게서 나왔는지
              </span>
            </CardContent>
          </Card>
          <Card size="sm" className="bg-secondary ring-0">
            <CardContent className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground">
                가장 큰 경고
              </span>
              <span className="text-sm font-medium">
                한 번 쓰고 돌아오지 않은 고객의 공통점
              </span>
            </CardContent>
          </Card>
          <Card size="sm" className="bg-secondary ring-0">
            <CardContent className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground">
                다음 주에 확인할 것
              </span>
              <span className="text-sm font-medium">
                재사용한 고객에게 추천 의향 물어보기
              </span>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <div className="aurora" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <main className="flex flex-col overflow-x-clip">
        {/* 1. 히어로 */}
        <section className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-5 pt-20 pb-16 md:items-center md:px-8 md:pt-36 md:pb-28 md:text-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-primary">핏체크 FitCheck</span>
            <Badge variant="outline" className="text-muted-foreground">
              연습용으로 만든 가상의 서비스예요
            </Badge>
          </div>
          <h1 className="text-4xl leading-[1.15] font-extrabold tracking-tight md:text-6xl">
            우리 제품, 시장에 맞고 있을까?
            <br />
            <span className="text-primary">매주 확인하세요</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-xl">
            첫 제품을 낸 1인·초기 창업자를 위한 PMF 진단 도구예요. 고객 반응을 넣으면
            이번 주 PMF 신호를 기준에 맞춰 정리해 드려요.
          </p>
          <StartButton className="mt-2" />
        </section>

        {/* 2. 문제 */}
        <section className="reveal mx-auto w-full max-w-5xl px-5 py-16 md:px-8 md:py-28">
          <SectionTitle eyebrow="문제" title="이게 된다는 신호일까요?" />
          <p className="mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            제품을 내고 몇 주가 지났어요. 가입자는 조금씩 생기는데, 이게 “된다”는
            신호인지 그냥 지인 효과인지 모르겠어요. 설문 응답 · 인터뷰 메모 · 사용
            기록은 여기저기 흩어져 있고, 정리하다 보면 한 주가 지나가요.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {pains.map((p) => (
              <Card key={p.title} className={glass}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{p.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {p.body}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. 작동 방식 */}
        <section className="reveal mx-auto w-full max-w-5xl px-5 py-16 md:px-8 md:py-28">
          <SectionTitle eyebrow="작동 방식" title="세 단계면 충분해요" />
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              {steps.map((s, i) => (
                <Card key={s.name} className={glass}>
                  <CardHeader className="grid-cols-[auto_1fr] items-start gap-x-4">
                    <Badge className="row-span-2 size-8 rounded-full p-0 text-sm font-bold">
                      {i + 1}
                    </Badge>
                    <CardTitle className="text-lg font-semibold">{s.name}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {s.body}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <ExampleScreen />
          </div>
        </section>

        {/* 4. 이래서 쓰게 돼요 */}
        <section className="reveal mx-auto w-full max-w-5xl px-5 py-16 md:px-8 md:py-28">
          <SectionTitle eyebrow="이래서 쓰게 돼요" title="처음 한 번, 그리고 매주" />
          <div className="grid gap-4 md:grid-cols-2">
            <Card className={glass}>
              <CardHeader className="gap-3">
                <Badge variant="secondary">처음 써 보면 ✨</Badge>
                <CardTitle className="text-xl leading-snug font-semibold">
                  흩어진 메모를 붙여 넣자마자 “이번 주 가장 강한 신호와 가장 큰
                  경고”가 한 장으로 정리돼 나와요.
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className={glass}>
              <CardHeader className="gap-3">
                <Badge variant="secondary">계속 쓰게 되는 이유</Badge>
                <CardTitle className="text-xl leading-snug font-semibold">
                  매주 리포트가 쌓이면서 PMF 에 가까워지는지 멀어지는지 흐름이
                  보여요.
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* 5. 다른 점 */}
        <section className="reveal mx-auto w-full max-w-3xl px-5 py-16 md:px-8 md:py-28">
          <SectionTitle eyebrow="다른 점" title="기준 하나로, 매주 쌓아 가요" />
          <Card className={glass}>
            <CardContent className="flex flex-col gap-5 py-2 text-base leading-relaxed">
              <div className="flex flex-col gap-1">
                <span className="font-semibold">엑셀 · 노션으로 직접 정리하면</span>
                <span className="text-muted-foreground">
                  기준이 매번 달라지고 시간이 들어요.
                </span>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="font-semibold">GPT 에 물어보면</span>
                <span className="text-muted-foreground">
                  그때그때 답은 주지만, 지난주와 비교하거나 같은 기준을 계속
                  적용하지는 않아요.
                </span>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-primary">핏체크는</span>
                <span>PMF 기준 하나로 매주 쌓아 가며 변화를 보여 줘요.</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 7. 시작하기 */}
        <section className="reveal mx-auto w-full max-w-3xl px-5 py-16 md:px-8 md:py-28">
          <Card className={`${glass} items-center gap-5 px-6 py-12 text-center`}>
            <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
              이번 주 PMF, 감 말고 기준으로
            </h2>
            <p className="text-base text-muted-foreground">
              열리면 가장 먼저 써 보고 솔직한 의견을 들려주세요.
            </p>
            <StartButton />
          </Card>
        </section>

        {/* 8. 만든 사람 */}
        <section className="reveal mx-auto w-full max-w-3xl px-5 py-16 md:px-8 md:py-28">
          <SectionTitle eyebrow="만든 사람" title="이수아" />
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            1인 창업가 · 프리랜서로 일하며 “이게 정말 될까?”를 혼자 판단해야 하는
            막막함을 직접 겪고 있어요.
          </p>
        </section>
      </main>

      {/* 9. 푸터 */}
      <footer className="mx-auto w-full max-w-5xl px-5 pb-12 md:px-8">
        <Separator className="mb-6" />
        <div className="flex flex-col gap-1 text-sm text-muted-foreground md:flex-row md:justify-between">
          <span>© 2026 핏체크</span>
          <span>Built with Claude Code · AI 프로덕트 빌더 클럽 3기</span>
        </div>
      </footer>
    </>
  );
}
