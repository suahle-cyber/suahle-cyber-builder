# 핏체크 (FitCheck) — 랜딩 페이지

> 연습용으로 만든 가상의 서비스예요. AI 프로덕트 빌더 클럽 3기 실습.

## 주소
- 사이트: https://suahle-cyber-builder.vercel.app
- GitHub 저장소: https://github.com/suahle-cyber/suahle-cyber-builder
- Supabase 대시보드: https://supabase.com/dashboard/project/kvpjjhkwptnrpahrwunb

## Supabase
연결만 해 둔 상태예요. 다음 주에 신청 저장 · 로그인 같은 기능을 붙일 때 씁니다.
DB 비밀번호는 내 컴퓨터의 `.env.local` 에만 있고, GitHub 와 Vercel 에는 올라가지 않아요.

## 다시 고칠 때
Claude 나 Codex 앱에서 이 폴더를 열고 고쳐 달라고 말한 다음:

```bash
git add -A && git commit -m "수정" && git push
vercel --prod --yes
```

첫 줄은 코드 저장(GitHub), 둘째 줄은 사이트 다시 올리기(Vercel)예요.
아직 GitHub → Vercel 자동 배포가 연결되지 않아서 두 줄 다 필요해요.
(연결하려면 vercel.com 의 이 프로젝트 → Settings → Git 에서 저장소를 연결하면, 그다음부터는 첫 줄만으로 사이트가 바뀝니다.)

## 도메인
내 도메인을 붙이고 싶으면 vercel.com 의 이 프로젝트 → Settings → Domains 에서 해요.
