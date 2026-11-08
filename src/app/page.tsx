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

const glass = "shadow-none";

const pains = [
  {
    title: "기록이 쌓이지 않아요",
    body: "인터뷰 기록이 녹음 파일 · 메모 앱 · 메신저에 흩어져 있다.",
  },
  {
    title: "판단으로 이어지지 않아요",
    body: "기록은 있는데 “누가 왜 돈을 낼지”는 결국 감으로 정한다.",
  },
  {
    title: "다시 연락할 때를 놓쳐요",
    body: "다시 만나야 할 고객과 시점을 놓친다.",
  },
];

const steps = [
  {
    name: "쌓기",
    body: "인터뷰 기록을 글로 붙여넣거나 .txt 파일로 올리면, 고객별 · 시간순으로 쌓여요.",
  },
  {
    name: "발굴",
    body: "[분석]을 누르면 반복되는 문제, 돈을 낸 이유, 강한 신호와 약한 신호를 고객이 실제로 한 문장과 함께 찾아 줘요. 기록에 없는 문장은 근거로 쓰지 않아요.",
  },
  {
    name: "알림",
    body: "근거가 부족한 가설이 생기면, 그 이야기를 한 고객을 '다시 연락할 사람'으로 띄우고 무엇을 물을지 알려 줘요. 다음 날 아침에는 메일로도 알려 드려요.",
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
          <CardTitle className="font-semibold">다시 연락할 사람</CardTitle>
          <Badge variant="secondary">1일째</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 py-5">
          <Card size="sm" className="bg-accent text-accent-foreground ring-0">
            <CardContent className="flex flex-col gap-1">
              <span className="text-xs font-semibold opacity-80">누구에게</span>
              <span className="text-sm font-medium">
                고객 B — 지난주 인터뷰에서 “팀원들이랑 같이 쓰면 회사 카드로 결제할 수도 있어요”
              </span>
            </CardContent>
          </Card>
          <Card size="sm" className="bg-secondary ring-0">
            <CardContent className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground">
                근거가 부족한 가설
              </span>
              <span className="text-sm font-medium">
                “팀 단위로 결제할 것이다” — 근거 문장 1개, 아직 부족
              </span>
            </CardContent>
          </Card>
          <Card size="sm" className="bg-secondary ring-0">
            <CardContent className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground">
                물어볼 것
              </span>
              <span className="text-sm font-medium">
                팀원 몇 명이 함께 쓰면 회사 카드로 결제할지, 지금 회사 카드로 쓰는 도구가 있는지
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
      <main className="flex flex-col overflow-x-clip">
        {/* 1. 히어로 */}
        <section className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-5 pt-20 pb-16 md:items-center md:px-8 md:pt-36 md:pb-28 md:text-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif text-base font-semibold">VOC tracker</span>
            <Badge variant="outline" className="text-muted-foreground">
              첫 버전을 만들고 있어요
            </Badge>
          </div>
          <h1 className="font-serif text-4xl leading-[1.25] font-semibold tracking-tight md:text-6xl">
            고객 인터뷰,
            <br />
            <span className="text-clay">PMF 판단으로 이어지게</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-xl">
            PMF 를 찾아가는 창업자를 위한 인터뷰 툴이에요. 인터뷰를 고객별로 쌓고,
            PMF 신호를 찾고, 누구에게 언제 다시 연락해 무엇을 물을지 알려 드려요.
          </p>
          <StartButton className="mt-2" />
        </section>

        {/* 2. 문제 */}
        <section className="reveal mx-auto w-full max-w-5xl px-5 py-16 md:px-8 md:py-28">
          <SectionTitle eyebrow="문제" title="인터뷰는 했는데, 다음은요?" />
          <p className="mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            고객 인터뷰는 계속 하는데, 기록은 녹음 파일 · 메모 앱 · 메신저에 흩어져
            있어요. 지난달 “이거 있으면 돈 내고 쓰겠다”던 고객에게 다시 연락할 때를
            놓치고, “누가 왜 돈을 낼지”는 결국 감으로 정해요.
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
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            첫 버전은 글로 된 인터뷰 기록만 받아요. 녹음 파일 받아쓰기, 회의 · 녹음 도구
            연결, 결제 · 매출 데이터와 맞춰 보기는 다음 버전에서 준비하고 있어요.
          </p>
        </section>

        {/* 4. 이래서 쓰게 돼요 */}
        <section className="reveal mx-auto w-full max-w-5xl px-5 py-16 md:px-8 md:py-28">
          <SectionTitle eyebrow="이래서 쓰게 돼요" title="처음 한 번, 그리고 쌓일수록" />
          <div className="grid gap-4 md:grid-cols-2">
            <Card className={glass}>
              <CardHeader className="gap-3">
                <Badge variant="secondary">처음 써 보면</Badge>
                <CardTitle className="text-xl leading-snug font-semibold">
                  인터뷰를 넣고 [분석]을 누르면 “다시 연락할 고객과 물어볼 것”이
                  고객이 한 문장과 함께 나와요.
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className={glass}>
              <CardHeader className="gap-3">
                <Badge variant="secondary">계속 쓰게 되는 이유</Badge>
                <CardTitle className="text-xl leading-snug font-semibold">
                  같은 고객의 이야기가 쌓일수록 “누가 왜 돈을 낼지”의 근거가
                  짙어져요.
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* 5. 다른 점 */}
        <section className="reveal mx-auto w-full max-w-3xl px-5 py-16 md:px-8 md:py-28">
          <SectionTitle eyebrow="다른 점" title="기록에서 멈추지 않아요" />
          <Card className={glass}>
            <CardContent className="flex flex-col gap-5 py-2 text-base leading-relaxed">
              <div className="flex flex-col gap-1">
                <span className="font-semibold">인터뷰 저장소 · 회의 노트 · 범용 AI 는</span>
                <span className="text-muted-foreground">
                  기록하고 요약해 주지만, 다시 연락할 때는 알려 주지 않아요.
                </span>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="font-semibold">CRM · 노션 리마인더는</span>
                <span className="text-muted-foreground">
                  날짜는 알려 주지만, 왜 · 무엇을 물어야 할지는 몰라요.
                </span>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-clay">VOC tracker 는</span>
                <span>같은 고객을 오래 추적하며 다시 연락할 사람 · 시점 · 질문을 알려 줘요.</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 7. 시작하기 */}
        <section className="reveal mx-auto w-full max-w-3xl px-5 py-16 md:px-8 md:py-28">
          <Card className={`${glass} items-center gap-5 px-6 py-12 text-center`}>
            <h2 className="text-2xl font-bold tracking-tight md:text-4xl">
              고객의 말을, 다음 결정으로
            </h2>
            <p className="text-base text-muted-foreground">
              예시 데이터로 먼저 둘러보고, 솔직한 의견을 들려주세요.
            </p>
            <StartButton />
          </Card>
        </section>

        {/* 8. 만든 사람 */}
        <section className="reveal mx-auto w-full max-w-3xl px-5 py-16 md:px-8 md:py-28">
          <SectionTitle eyebrow="만든 사람" title="이수아" />
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            1인 창업가 · 프리랜서로 일하며 고객 인터뷰를 직접 하고, 그 기록이 판단으로
            이어지지 않는 막막함을 겪고 있어요. 제 인터뷰 기록으로 첫 사용자가 되어 직접
            써 볼 거예요.
          </p>
        </section>
      </main>

      {/* 9. 푸터 */}
      <footer className="mx-auto w-full max-w-5xl px-5 pb-12 md:px-8">
        <Separator className="mb-6" />
        <div className="flex flex-col gap-1 text-sm text-muted-foreground md:flex-row md:justify-between">
          <span>© 2026 VOC tracker</span>
          <span>Built with Claude Code · AI 프로덕트 빌더 클럽 3기</span>
        </div>
      </footer>
    </>
  );
}
