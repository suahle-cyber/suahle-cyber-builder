import { AppHeader } from "./app-header";

// 로그인한 뒤 보는 모든 /app 화면의 공통 틀 — 위(휴대폰은 아래) 메뉴 + 본문 (T-04).
// 로그인 화면(/app/login)은 이 묶음 밖이라 메뉴가 없다.
export default function MainLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
