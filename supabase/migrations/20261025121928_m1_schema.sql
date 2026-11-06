-- VOC tracker M1 저장 구조 (DB.md 3단계 설계, DECISIONS.md D-07)
-- 모든 표는 본인(user_id = auth.uid())만 읽고 쓴다. 로그인 안 한 사람(anon)은 아무것도 못 한다.
-- 날짜 칸(interview_date · recommended_on · contacted_on)은 한국 날짜(Asia/Seoul) 기준이다.

-- ─────────────────────────────────────────────
-- 공통 함수
-- ─────────────────────────────────────────────

-- 한국 날짜 '오늘'. 서버 · Vercel Cron 은 UTC 로 돌기 때문에 날짜 기본값은 항상 이 함수로 만든다.
create or replace function public.kst_today()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'Asia/Seoul')::date;
$$;

-- 수정할 때 updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────
-- 표
-- ─────────────────────────────────────────────

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  alias text not null check (char_length(alias) between 1 and 40),
  company text check (company is null or char_length(company) <= 40),
  memo text check (memo is null or char_length(memo) <= 1000),
  is_example boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, alias)
);

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  interview_date date not null default public.kst_today(),
  body text not null check (char_length(body) between 1 and 50000),
  source text not null default 'paste' check (source in ('paste', 'txt')),
  analysis_status text not null default 'pending'
    check (analysis_status in ('pending', 'running', 'done', 'failed')),
  analyzed_at timestamptz,
  is_example boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hypotheses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  statement text not null check (char_length(statement) between 1 and 300),
  status text not null default 'checking'
    check (status in ('checking', 'supported', 'rejected', 'paused')),
  evidence_state text not null default 'unknown'
    check (evidence_state in ('unknown', 'enough', 'lacking')),
  is_example boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  interview_id uuid not null references public.interviews (id) on delete cascade,
  hypothesis_id uuid references public.hypotheses (id) on delete set null,
  kind text not null check (kind in ('repeated_problem', 'reason_to_pay', 'strong', 'weak')),
  summary text not null check (char_length(summary) between 1 and 200),
  quote text not null check (char_length(quote) between 1 and 500),
  is_example boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.followups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  hypothesis_id uuid not null references public.hypotheses (id) on delete cascade,
  evidence_signal_id uuid references public.signals (id) on delete set null,
  recommended_on date not null default public.kst_today(),
  question text not null check (char_length(question) between 1 and 300),
  question_edited boolean not null default false,
  status text not null default 'recommended'
    check (status in ('recommended', 'contacted', 'skipped')),
  contacted_on date,
  skipped_reason text check (skipped_reason is null or char_length(skipped_reason) <= 200),
  notified_at timestamptz,
  -- 첫 실험 지표: 추천이 생긴 날부터 7일 안에 '연락함'을 눌렀나 (한국 날짜 기준)
  within_7_days boolean generated always as (
    status = 'contacted' and contacted_on is not null and contacted_on - recommended_on <= 7
  ) stored,
  is_example boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- 연락함이면 연락한 날짜가 꼭 있고, 아니면 비어 있다
  check ((status = 'contacted') = (contacted_on is not null)),
  check (contacted_on is null or contacted_on >= recommended_on)
);

-- 같은 고객 · 같은 가설에 '추천' 상태 추천은 1건만
create unique index followups_one_open_per_customer_hypothesis
  on public.followups (customer_id, hypothesis_id)
  where status = 'recommended';

-- ─────────────────────────────────────────────
-- 인덱스
-- ─────────────────────────────────────────────
create index interviews_user_customer_date on public.interviews (user_id, customer_id, interview_date desc);
create index interviews_customer on public.interviews (customer_id);
create index hypotheses_user on public.hypotheses (user_id);
create index signals_user on public.signals (user_id);
create index signals_interview on public.signals (interview_id);
create index signals_hypothesis on public.signals (hypothesis_id);
create index followups_user_status on public.followups (user_id, status);
create index followups_customer on public.followups (customer_id);
create index followups_hypothesis on public.followups (hypothesis_id);
create index followups_evidence_signal on public.followups (evidence_signal_id);
-- 아침 알림이 '아직 안 보낸 추천'을 빨리 찾도록
create index followups_to_notify on public.followups (recommended_on)
  where status = 'recommended' and notified_at is null;

-- ─────────────────────────────────────────────
-- updated_at 트리거
-- ─────────────────────────────────────────────
create trigger customers_updated_at before update on public.customers
  for each row execute function public.set_updated_at();
create trigger interviews_updated_at before update on public.interviews
  for each row execute function public.set_updated_at();
create trigger hypotheses_updated_at before update on public.hypotheses
  for each row execute function public.set_updated_at();
create trigger followups_updated_at before update on public.followups
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- 근거 문장 대조: signals.quote 가 그 인터뷰 본문에 그대로 있어야 저장된다 (AI 가 지어낸 문장 거부)
-- ─────────────────────────────────────────────
create or replace function public.check_signal_quote()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_body text;
begin
  select i.body into v_body
  from public.interviews i
  where i.id = new.interview_id and i.user_id = new.user_id;

  if v_body is null then
    raise exception 'interview not found for this user';
  end if;

  if strpos(v_body, new.quote) = 0 then
    raise exception 'quote is not in the interview body';
  end if;

  return new;
end;
$$;

create trigger signals_check_quote before insert or update on public.signals
  for each row execute function public.check_signal_quote();

-- ─────────────────────────────────────────────
-- 접근 규칙 (RLS) — DB.md 4번 표와 같다
-- ─────────────────────────────────────────────
alter table public.customers enable row level security;
alter table public.interviews enable row level security;
alter table public.hypotheses enable row level security;
alter table public.signals enable row level security;
alter table public.followups enable row level security;

-- 로그인 안 한 사람은 표에 접근 자체를 못 한다
revoke all on public.customers, public.interviews, public.hypotheses, public.signals, public.followups from anon;

-- customers
create policy "customers: 본인 보기" on public.customers
  for select to authenticated using (user_id = (select auth.uid()));
create policy "customers: 본인 추가" on public.customers
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "customers: 본인 수정" on public.customers
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "customers: 본인 삭제" on public.customers
  for delete to authenticated using (user_id = (select auth.uid()));

-- interviews: 가리키는 고객도 본인 것이어야 한다
create policy "interviews: 본인 보기" on public.interviews
  for select to authenticated using (user_id = (select auth.uid()));
create policy "interviews: 본인 추가" on public.interviews
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.customers c where c.id = customer_id and c.user_id = (select auth.uid()))
  );
create policy "interviews: 본인 수정" on public.interviews
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.customers c where c.id = customer_id and c.user_id = (select auth.uid()))
  );
create policy "interviews: 본인 삭제" on public.interviews
  for delete to authenticated using (user_id = (select auth.uid()));

-- hypotheses
create policy "hypotheses: 본인 보기" on public.hypotheses
  for select to authenticated using (user_id = (select auth.uid()));
create policy "hypotheses: 본인 추가" on public.hypotheses
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "hypotheses: 본인 수정" on public.hypotheses
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "hypotheses: 본인 삭제" on public.hypotheses
  for delete to authenticated using (user_id = (select auth.uid()));

-- signals: 보기 · 추가 · 삭제만 (수정은 '다시 분석'으로). 가리키는 인터뷰 · 가설도 본인 것이어야 한다
create policy "signals: 본인 보기" on public.signals
  for select to authenticated using (user_id = (select auth.uid()));
create policy "signals: 본인 추가" on public.signals
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.interviews i where i.id = interview_id and i.user_id = (select auth.uid()))
    and (hypothesis_id is null
      or exists (select 1 from public.hypotheses h where h.id = hypothesis_id and h.user_id = (select auth.uid())))
  );
create policy "signals: 본인 삭제" on public.signals
  for delete to authenticated using (user_id = (select auth.uid()));
revoke update on public.signals from authenticated;

-- followups: 가리키는 고객 · 가설 · 근거 신호도 본인 것이어야 한다
create policy "followups: 본인 보기" on public.followups
  for select to authenticated using (user_id = (select auth.uid()));
create policy "followups: 본인 추가" on public.followups
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.customers c where c.id = customer_id and c.user_id = (select auth.uid()))
    and exists (select 1 from public.hypotheses h where h.id = hypothesis_id and h.user_id = (select auth.uid()))
    and (evidence_signal_id is null
      or exists (select 1 from public.signals s where s.id = evidence_signal_id and s.user_id = (select auth.uid())))
  );
create policy "followups: 본인 수정" on public.followups
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.customers c where c.id = customer_id and c.user_id = (select auth.uid()))
    and exists (select 1 from public.hypotheses h where h.id = hypothesis_id and h.user_id = (select auth.uid()))
    and (evidence_signal_id is null
      or exists (select 1 from public.signals s where s.id = evidence_signal_id and s.user_id = (select auth.uid())))
  );
create policy "followups: 본인 삭제" on public.followups
  for delete to authenticated using (user_id = (select auth.uid()));

-- ─────────────────────────────────────────────
-- 예시 데이터: 로그인한 본인 이름으로 '연습용 예시'를 한 번 넣는다 (DB.md 8번)
-- 호출한 사람의 권한으로 돌아서(security invoker) 접근 규칙이 그대로 적용된다.
-- ─────────────────────────────────────────────
create or replace function public.seed_example_data()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_today date := public.kst_today();
  c_a uuid; c_b uuid; c_c uuid;
  h_1 uuid; h_2 uuid; h_3 uuid;
  i_1 uuid; i_2 uuid; i_3 uuid; i_4 uuid;
  s_h2a uuid; s_h3b uuid;
begin
  if v_uid is null then
    raise exception 'login required';
  end if;

  -- 이미 예시가 있으면 다시 넣지 않는다
  if exists (select 1 from public.customers where user_id = v_uid and is_example) then
    return;
  end if;

  insert into public.customers (user_id, alias, company, memo, is_example)
    values (v_uid, '예시 고객 A', '예시 스타트업', '첫 제품 출시 3개월 차 (연습용 예시)', true)
    returning id into c_a;
  insert into public.customers (user_id, alias, company, memo, is_example)
    values (v_uid, '예시 고객 B', '예시 컴퍼니', '팀 4명, 시드 준비 중 (연습용 예시)', true)
    returning id into c_b;
  insert into public.customers (user_id, alias, company, memo, is_example)
    values (v_uid, '예시 고객 C', null, '1인 창업 준비 중 (연습용 예시)', true)
    returning id into c_c;

  insert into public.hypotheses (user_id, statement, evidence_state, is_example)
    values (v_uid, '초기 창업자는 인터뷰 기록이 흩어져 다시 찾지 못한다', 'enough', true)
    returning id into h_1;
  insert into public.hypotheses (user_id, statement, evidence_state, is_example)
    values (v_uid, '창업자는 고객에게 다시 연락할 때를 놓친다', 'enough', true)
    returning id into h_2;
  insert into public.hypotheses (user_id, statement, evidence_state, is_example)
    values (v_uid, '팀 단위로 결제할 것이다', 'lacking', true)
    returning id into h_3;

  insert into public.interviews (user_id, customer_id, interview_date, body, analysis_status, analyzed_at, is_example)
    values (v_uid, c_a, v_today - 20,
      E'Q. 인터뷰 기록은 어디에 남기세요?\nA. 인터뷰 메모가 노션, 카톡, 녹음 앱에 다 흩어져 있어요.\nQ. 다시 연락한 적은요?\nA. 다시 연락하려고 했는데 시기를 놓쳤어요.',
      'done', now(), true)
    returning id into i_1;
  insert into public.interviews (user_id, customer_id, interview_date, body, analysis_status, analyzed_at, is_example)
    values (v_uid, c_a, v_today - 8,
      E'Q. 지금 이 문제에 돈을 쓰고 계세요?\nA. 지난달에 정리 도구에 월 3만 원을 썼어요.\nQ. 만족하세요?\nA. 정리는 되는데 다음에 뭘 할지는 안 알려 줘요.',
      'done', now(), true)
    returning id into i_2;
  insert into public.interviews (user_id, customer_id, interview_date, body, analysis_status, analyzed_at, is_example)
    values (v_uid, c_b, v_today - 5,
      E'Q. 인터뷰 후에 가장 어려운 점은요?\nA. 고객한테 언제 다시 물어볼지 늘 까먹어요.\nQ. 결제는 누가 하나요?\nA. 팀원들이랑 같이 쓰면 회사 카드로 결제할 수도 있어요.',
      'done', now(), true)
    returning id into i_3;
  insert into public.interviews (user_id, customer_id, interview_date, body, analysis_status, analyzed_at, is_example)
    values (v_uid, c_c, v_today - 3,
      E'Q. 지난 인터뷰를 다시 볼 때가 있나요?\nA. 인터뷰 기록을 다시 찾느라 한 시간씩 써요.\nQ. 새 인터뷰는 아직 정리 전이에요.',
      'pending', null, true)
    returning id into i_4;

  insert into public.signals (user_id, interview_id, hypothesis_id, kind, summary, quote, is_example)
    values (v_uid, i_1, h_1, 'repeated_problem', '인터뷰 메모가 여러 도구에 흩어져 있다',
      '인터뷰 메모가 노션, 카톡, 녹음 앱에 다 흩어져 있어요.', true);
  insert into public.signals (user_id, interview_id, hypothesis_id, kind, summary, quote, is_example)
    values (v_uid, i_1, h_2, 'repeated_problem', '다시 연락할 시기를 놓쳤다',
      '다시 연락하려고 했는데 시기를 놓쳤어요.', true)
    returning id into s_h2a;
  insert into public.signals (user_id, interview_id, hypothesis_id, kind, summary, quote, is_example)
    values (v_uid, i_2, null, 'reason_to_pay', '정리 도구에 이미 월 3만 원을 쓴다',
      '지난달에 정리 도구에 월 3만 원을 썼어요.', true);
  insert into public.signals (user_id, interview_id, hypothesis_id, kind, summary, quote, is_example)
    values (v_uid, i_3, h_2, 'repeated_problem', '다시 물어볼 때를 늘 잊는다',
      '고객한테 언제 다시 물어볼지 늘 까먹어요.', true);
  insert into public.signals (user_id, interview_id, hypothesis_id, kind, summary, quote, is_example)
    values (v_uid, i_3, h_3, 'weak', '팀으로 쓰면 회사 카드로 낼 수도 있다(조건부)',
      '팀원들이랑 같이 쓰면 회사 카드로 결제할 수도 있어요.', true)
    returning id into s_h3b;
  insert into public.signals (user_id, interview_id, hypothesis_id, kind, summary, quote, is_example)
    values (v_uid, i_4, h_1, 'strong', '기록을 다시 찾는 데 한 시간씩 쓴다',
      '인터뷰 기록을 다시 찾느라 한 시간씩 써요.', true);

  -- B: 결제 가설 근거 부족 → 추천 상태
  insert into public.followups (user_id, customer_id, hypothesis_id, evidence_signal_id, recommended_on, question, is_example)
    values (v_uid, c_b, h_3, s_h3b, v_today - 1,
      '팀원 몇 명이 함께 쓰면 회사 카드로 결제할지, 지금 회사 카드로 쓰는 도구가 있는지 물어보기', true);
  -- A: 예전에 '다시 연락' 가설이 근거 부족이었을 때의 추천 → 3일 만에 연락함 (7일 안 ✓)
  insert into public.followups (user_id, customer_id, hypothesis_id, evidence_signal_id, recommended_on, question, status, contacted_on, notified_at, is_example)
    values (v_uid, c_a, h_2, s_h2a, v_today - 19,
      '다시 연락할 시기를 놓친 일이 몇 번 있었는지, 그때 무엇을 잃었는지 물어보기',
      'contacted', v_today - 16, now() - interval '18 days', true);
end;
$$;

revoke all on function public.seed_example_data() from public, anon;
grant execute on function public.seed_example_data() to authenticated;
