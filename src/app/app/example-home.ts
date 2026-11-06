// 4단계 디자인 확인용 '연습용 예시' 데이터.
// 내용은 seed_example_data()(supabase/migrations/…_m1_schema.sql)와 같다.
// 5단계(T-12 · T-15)에서 이 파일 대신 Supabase 의 followups · customers · hypotheses · signals 를 읽는다.

export type OpenFollowup = {
  id: string;
  customerAlias: string;
  company: string | null;
  recommendedOn: string; // YYYY-MM-DD (한국 날짜)
  question: string;
  hypothesis: string;
  quote: string;
  quoteDate: string;
};

export type PastFollowup = {
  id: string;
  customerAlias: string;
  company: string | null;
  recommendedOn: string;
  status: "contacted" | "skipped";
  doneOn: string;
  question: string;
};

export type HomeData = {
  today: string;
  open: OpenFollowup[];
  past: PastFollowup[];
  pendingInterviews: { customerAlias: string; interviewDate: string }[];
};

// 한국 날짜(Asia/Seoul) 기준 오늘에서 days 만큼 뺀 날짜
export function kstDate(daysAgo = 0): string {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

export function getExampleHome(): HomeData {
  return {
    today: kstDate(0),
    open: [
      {
        id: "ex-b",
        customerAlias: "예시 고객 B",
        company: "예시 컴퍼니",
        recommendedOn: kstDate(1),
        question:
          "팀원 몇 명이 함께 쓰면 회사 카드로 결제할지, 지금 회사 카드로 쓰는 도구가 있는지 물어보기",
        hypothesis: "팀 단위로 결제할 것이다",
        quote: "팀원들이랑 같이 쓰면 회사 카드로 결제할 수도 있어요.",
        quoteDate: kstDate(5),
      },
    ],
    past: [
      {
        id: "ex-a",
        customerAlias: "예시 고객 A",
        company: "예시 스타트업",
        recommendedOn: kstDate(19),
        status: "contacted",
        doneOn: kstDate(16),
        question: "다시 연락할 시기를 놓친 일이 몇 번 있었는지, 그때 무엇을 잃었는지 물어보기",
      },
    ],
    pendingInterviews: [{ customerAlias: "예시 고객 C", interviewDate: kstDate(3) }],
  };
}
