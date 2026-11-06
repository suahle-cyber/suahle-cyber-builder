# DB.md — VOC tracker 저장할 데이터 (M1)

> 3단계 확정 · 생성 완료 (2026-10-25, D-07 · D-08). migration: `supabase/migrations/20261025121928_m1_schema.sql`, 타입: `src/lib/database.types.ts`. FLOW.md 화면 6개 · DECISIONS.md D-01~D-06 기준. 저장 위치: Supabase Postgres(1주차에 연결한 프로젝트). 로그인: Supabase Auth Google(D-05).
> 바꿀 때는 `npx supabase migration new` → `npx supabase db push` 로만 한다(AGENTS.md).

## 0. 이 단계에서 정한 규칙 (D-07 확인 받음)
- **신호 종류 4가지** (`signal_kind`)
  - `repeated_problem` 반복 문제 — 고객이 겪는 같은 불편이 이 인터뷰에서 드러남
  - `reason_to_pay` 돈 낸 이유 — 이미 돈을 썼거나 쓰겠다고 한 이유가 나옴
  - `strong` 강한 신호 — 구체적 행동 · 날짜 · 금액이 붙은 말("지난달 30만 원 썼다", "다음 주에 팀에 소개하겠다")
  - `weak` 약한 신호 — 행동 없이 의견만("좋을 것 같다", "있으면 쓸 것 같다")
- **가설 상태** (`hypothesis_status`) — 사용자가 직접 바꾼다: `checking` 확인 중(기본) · `supported` 맞는 것 같음 · `rejected` 틀린 것 같음 · `paused` 보류
- **근거 판정** (`evidence_state`) — 분석이 정한다: `unknown` 아직 판단 전(기본) · `enough` 충분 · `lacking` 부족
  - 충분 = 이 가설의 근거 문장이 **서로 다른 고객 2명 이상**에서 나옴. 그 밖에는 부족. 판정은 분석이 끝날 때마다 다시 계산한다.
- **다시 연락 추천(D-04)** — 가설이 `lacking` 이 되면, 그 가설 얘기가 나온 고객마다 추천 1건을 만든다. 같은 고객 · 같은 가설에 열린 추천은 1건만. `recommended_on` = 추천이 생긴 한국 날짜.
- **7일 안 연락** — `contacted_on - recommended_on <= 7` (한국 날짜 기준).

## 1. 표 목록 (5개)
| 표 | 한 줄 설명 |
|---|---|
| `customers` | 인터뷰한 고객 — 별칭 · 회사 · 메모 |
| `interviews` | 인터뷰 기록 — 어느 고객 · 날짜 · 기록 본문 · 분석 상태 |
| `hypotheses` | 확인하고 싶은 가설 — 문장 · 상태 · 근거 판정 |
| `signals` | 분석이 뽑은 신호 카드 — 종류 · 한 줄 요약 · 근거 원문 문장 · 관련 가설 |
| `followups` | 다시 연락 추천 — 누구 · 언제 · 무엇을 · 왜 · 연락함/건너뜀 · 메일 보낸 시각 |

사용자 정보(이름 · 이메일)는 Supabase Auth 의 `auth.users` 에 있다. 따로 프로필 표를 만들지 않는다. 알림 메일 주소는 Google 계정 이메일을 서버에서만 읽는다.

## 2. 표별 칸
모든 표 공통: `id uuid` 기본 `gen_random_uuid()` · `user_id uuid` 필수, 기본 `auth.uid()`, `auth.users` 를 가리킴(사용자 삭제 시 함께 삭제) · `is_example boolean` 필수, 기본 `false`(연습용 예시 표시 · [예시 지우기]용) · `created_at timestamptz` 기본 `now()`. 수정되는 표는 `updated_at timestamptz` 기본 `now()` (수정할 때 자동 갱신).

### `customers`
| 칸 | 종류 | 필수 | 기본값 | 설명 |
|---|---|---|---|---|
| alias | text | 예 | | 별칭(1~40자). 실명 대신 별칭 권장 ⚠️개인정보 |
| company | text | 아니요 | | 회사 · 팀(40자 이하) ⚠️개인정보 |
| memo | text | 아니요 | | 메모(1000자 이하) |
| updated_at | timestamptz | 예 | now() | |

### `interviews`
| 칸 | 종류 | 필수 | 기본값 | 설명 |
|---|---|---|---|---|
| customer_id | uuid | 예 | | 어느 고객 → customers |
| interview_date | date | 예 | 한국 오늘 | 인터뷰한 날(한국 날짜) |
| body | text | 예 | | 기록 본문(1~50,000자) ⚠️가장 민감 |
| source | text | 예 | 'paste' | 'paste' 붙여넣기 / 'txt' 파일 |
| analysis_status | text | 예 | 'pending' | 'pending' 분석 전 / 'running' 분석 중 / 'done' 완료 / 'failed' 실패 |
| analyzed_at | timestamptz | 아니요 | | 마지막 분석 시각 |
| updated_at | timestamptz | 예 | now() | |

### `hypotheses`
| 칸 | 종류 | 필수 | 기본값 | 설명 |
|---|---|---|---|---|
| statement | text | 예 | | 가설 문장(1~300자) |
| status | text | 예 | 'checking' | 사용자가 정하는 상태(위 0번) |
| evidence_state | text | 예 | 'unknown' | 분석이 정하는 근거 판정(위 0번) |
| updated_at | timestamptz | 예 | now() | |

### `signals`
| 칸 | 종류 | 필수 | 기본값 | 설명 |
|---|---|---|---|---|
| interview_id | uuid | 예 | | 어느 인터뷰에서 나왔나 → interviews |
| hypothesis_id | uuid | 아니요 | | 근거가 된 가설 → hypotheses (없을 수 있음) |
| kind | text | 예 | | 신호 종류 4가지(위 0번) |
| summary | text | 예 | | 한 줄 요약(200자 이하) |
| quote | text | 예 | | 근거 원문 문장(1~500자). **그 인터뷰 본문에 그대로 있어야 저장됨** |

### `followups`
| 칸 | 종류 | 필수 | 기본값 | 설명 |
|---|---|---|---|---|
| customer_id | uuid | 예 | | 누구에게 → customers |
| hypothesis_id | uuid | 예 | | 왜(근거 부족 가설) → hypotheses |
| evidence_signal_id | uuid | 아니요 | | 카드에 보여 줄 근거 문장 → signals |
| recommended_on | date | 예 | 한국 오늘 | 언제 — 추천이 생긴 한국 날짜 |
| question | text | 예 | | 무엇을 물을지(300자 이하) |
| question_edited | boolean | 예 | false | 사용자가 물어볼 것을 고쳤나(추천 품질 확인용) |
| status | text | 예 | 'recommended' | 'recommended' 추천 / 'contacted' 연락함 / 'skipped' 건너뜀 |
| contacted_on | date | 아니요 | | 연락한 한국 날짜. 연락함일 때만, 그때는 꼭 있어야 함 |
| skipped_reason | text | 아니요 | | 건너뛴 이유(선택, 200자 이하) |
| notified_at | timestamptz | 아니요 | | 알림 메일에 넣어 보낸 시각. 비어 있을 때만 보냄(두 번 안 보내기) |
| within_7_days | boolean | 자동 | | 연락함이고 contacted_on − recommended_on ≤ 7 이면 참(자동 계산 칸) |
| updated_at | timestamptz | 예 | now() | |

## 3. 관계
- `customers` 1 → 여러 `interviews` · 여러 `followups`. 고객을 지우면 그 고객의 인터뷰 · 추천도 함께 지워진다.
- `interviews` 1 → 여러 `signals`. 인터뷰를 지우면 그 신호도 함께 지워진다(다시 분석할 때도 이전 신호를 지우고 새로 넣는다).
- `hypotheses` 1 → 여러 `signals` · 여러 `followups`. 가설을 지우면 신호의 가설 연결은 비워지고(신호는 남음), 그 가설로 생긴 추천은 함께 지워진다.
- `signals` 1 → `followups.evidence_signal_id`. 신호를 지우면 추천의 근거 문장 연결만 비워진다.
- 사용자(`auth.users`)를 지우면 그 사용자의 모든 행이 함께 지워진다.
- **다른 사람 것을 가리키지 못하게**: 인터뷰 · 신호 · 추천이 가리키는 고객 · 인터뷰 · 가설 · 신호는 모두 같은 사용자 것이어야 한다(접근 규칙에서 검사).

## 4. 누가 읽고 쓰나 (= 접근 규칙 RLS)
| 표 | 로그인 안 한 사람 | 로그인한 본인 | 다른 사용자 | 운영자 |
|---|---|---|---|---|
| customers | ✗ 없음 | 보기 · 추가 · 수정 · 삭제 | ✗ 없음 | ✗ 없음 |
| interviews | ✗ 없음 | 보기 · 추가 · 수정 · 삭제 | ✗ 없음 | ✗ 없음 |
| hypotheses | ✗ 없음 | 보기 · 추가 · 수정 · 삭제 | ✗ 없음 | ✗ 없음 |
| signals | ✗ 없음 | 보기 · 추가 · 삭제 (수정 없음 — 다시 분석으로 바꿈) | ✗ 없음 | ✗ 없음 |
| followups | ✗ 없음 | 보기 · 추가 · 수정 · 삭제 | ✗ 없음 | ✗ 없음 |

- "본인" = 행의 `user_id` 가 로그인한 사람(`auth.uid()`)과 같을 때. 추가 · 수정할 때도 `user_id` 를 남의 것으로 바꿀 수 없다.
- 운영자도 화면 · 대시보드로 기록을 보지 않는 것이 기본(M2 에서 실험 결과를 모을 때 다시 정함 — 그때도 본문 없이 숫자만).
- 예외 하나: 매일 아침 알림을 보내는 서버 기능(Vercel Cron)은 모든 사용자의 '알림 보낼 추천'을 찾아야 해서 서버 전용 비밀 키로 읽는다. 이 키는 서버에만 두고, 이 기능은 `followups` · 고객 별칭 · 가설 문장 · 사용자 이메일만 읽고 `notified_at` 만 쓴다(인터뷰 본문은 읽지 않음). 5단계에서 만든다.

## 5. 제약 · 인덱스
- 글자 수 제한: 위 표의 길이 제한을 DB 에서도 검사.
- 값 범위: `source`, `analysis_status`, `status`, `evidence_state`, `kind`, `followups.status` 는 정해진 값만.
- `followups`: 연락함이면 `contacted_on` 필수, 아니면 비어 있어야 함. `contacted_on >= recommended_on`.
- 중복 막기: 같은 사용자 안에서 고객 별칭 중복 금지 · 같은 고객 · 같은 가설에 '추천' 상태 추천은 1건만.
- **근거 문장 대조**: `signals.quote` 가 그 인터뷰 `body` 안에 그대로 있지 않으면 저장 거부(DB 가 검사). 서버에서도 먼저 대조해 없는 것은 버린다.
- 날짜: `interview_date` · `recommended_on` · `contacted_on` 은 한국 날짜(`Asia/Seoul`). 기본값도 한국 날짜로 계산. Vercel Cron 은 UTC 로 돈다는 점을 5단계 코드에 적는다.
- 인덱스: interviews(user_id, customer_id, interview_date) · signals(interview_id) · signals(hypothesis_id) · followups(user_id, status) · followups(notified_at) 중 아직 안 보낸 추천.

## 6. 개인정보
- 모으는 것: 고객 별칭 · 회사 · 메모, 인터뷰 본문(고객 발언), 사용자 Google 이메일(로그인 · 알림용).
- ⚠️ `customers.alias` — 누구에게 연락할지 알아보려면 필요. 실명 대신 별칭을 쓰라고 화면에 안내.
- ⚠️ `customers.company` — 같은 회사 고객을 구분하려면 있으면 좋음. 선택 입력.
- ⚠️ `interviews.body` — 서비스의 핵심이라 필요. 분석 때 Claude(외부 AI)로 보낸다. 서버 로그에 찍지 않는다. 개발 · 첫 확인은 가짜 기록으로만.
- **일부러 모으지 않는 것**: 인터뷰 상대의 전화번호 · 이메일 · 사진. 실제 연락은 앱 밖에서 하므로 필요 없다.
- 지우기: 고객을 지우면 그 고객의 인터뷰 · 신호 · 추천이 모두 지워진다. 실제 기록 보관 기간은 PLAN.md 미정 사항(동의 범위)에서 정한다.

## 7. 파일
- 없음. .txt 파일은 브라우저에서 글자로 읽어 `interviews.body` 에 넣는다. 파일 자체는 저장하지 않아 저장 공간(Storage)을 만들지 않는다.

## 8. 시드(예시) 데이터 — 모두 `is_example = true`
사용자마다 자기 예시가 필요해서(접근 규칙상 남의 예시는 안 보임), **로그인한 사람 본인 이름으로 예시를 넣는 DB 기능 `seed_example_data()`** 를 만든다. 처음 /app 에 들어올 때 앱이 한 번 부른다. 이미 예시가 있으면 다시 넣지 않는다. 사람 이름처럼 보이는 가짜 개인정보는 쓰지 않는다.
- 고객 3명: `예시 고객 A`(예시 스타트업), `예시 고객 B`(예시 컴퍼니), `예시 고객 C`(회사 없음)
- 가설 3개: "초기 창업자는 인터뷰 기록이 흩어져 다시 찾지 못한다"(근거 충분) · "창업자는 다시 연락할 때를 놓친다"(근거 충분) · "팀 단위로 결제할 것이다"(근거 부족)
- 인터뷰 4개: A 2개, B 1개, C 1개 — 짧은 가짜 대화
- 신호 6개: 각 인터뷰 본문에 실제로 있는 문장을 인용
- 추천 2개: B(결제 가설, 추천 상태) · A(결제 가설, 연락함 — 3일 만에 연락, 7일 안 ✓)

## 9. 생성 · 점검 기록 (2026-10-25)
- 생성: `npx supabase db push --linked` 로 반영 완료(DB 비밀번호는 `.env.local` 에서 읽음).
- 보안 점검(Supabase advisors, security): 경고 0건. 성능 점검: '아직 안 쓴 인덱스' 안내(INFO) 11건 — 표를 방금 만들어 생기는 정상 안내라 그대로 둠.
  - CLI `npx supabase db advisors` 는 이 컴퓨터에서 3분 넘게 멈춰서, 연결된 Supabase 커넥터(MCP)의 같은 점검으로 대신 확인함.
- 타입 파일: CLI `gen types --linked` 대신 Supabase 커넥터의 타입 생성 결과를 `src/lib/database.types.ts` 에 저장.

### 접근 점검 결과
점검 방법: DB 안에서 가짜 사용자 A · B 와 로그인 안 한 사람(anon) 권한으로 바꿔 가며 실행하고, 끝에 전부 되돌림(롤백). 관리자 비밀 키는 쓰지 않음. 점검 후 테스트 계정 0 · 자료 0 확인.

| 점검 | 기대 | 결과 |
|---|---|---|
| A: 예시 넣기 → 고객 3 · 인터뷰 4 · 가설 3 · 신호 6 · 추천 2 | 보임 | ✅ |
| A: 예시 7일 안 연락 계산 | 1건 | ✅ |
| A: 예시를 두 번 넣어도 중복 없음 | 고객 3 | ✅ |
| A: 자기 고객 추가 · 수정 · 삭제 | 됨 | ✅ |
| A: 본문에 없는 '지어낸 근거 문장' 신호 저장 | 거부 | ✅ |
| B: A 의 고객 · 인터뷰 · 가설 · 신호 · 추천 보기 | 0건 | ✅ |
| B: A 의 고객 수정 · 삭제 | 0행 | ✅ |
| B: A 의 고객에 인터뷰 추가 | 거부 | ✅ |
| B: A 이름(user_id)으로 고객 추가 | 거부 | ✅ |
| 로그인 안 한 사람: 고객 · 인터뷰 보기 | 거부 | ✅ |
| 로그인 안 한 사람: 추가 · 예시 넣기 | 거부 | ✅ |
| 사진 · 파일 저장소 | 없음(만들지 않음) | 해당 없음 |
| 서버 기능(분석 · 아침 알림) | 아직 없음 | 미확인 — 5단계에서 같은 기준으로 점검 |
| 실제 Google 로그인으로 화면에서 확인 | | 미확인 — Google 로그인 설정(R-03) 후 5단계에서 |
