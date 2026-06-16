# Maid-in-Korea Frontend

Maid-in-Korea 프론트엔드는 사용자가 메이드 카페 정보를 탐색하고, 메이드와 관리자가 각자의 업무를 처리할 수 있도록 제공되는 React 웹 애플리케이션입니다.

Vite 기반으로 동작하며, 백엔드 API 서버(`http://localhost:8080`)와 통신합니다. 개발 서버에서는 `/api`, `/auth`, `/oauth` 경로가 백엔드로 프록시됩니다.

## 기술 스택

- React 18
- Vite 6
- TypeScript
- TailwindCSS 4
- React Router 7
- Radix UI 기반 공통 UI 컴포넌트
- MUI Icons, lucide-react
- Fetch API

> 프로젝트 기준 기술에는 Redux가 포함되어 있으나, 현재 소스에는 Redux store 설정이나 관련 의존성이 아직 연결되어 있지 않습니다.

## 실행 방법

```bash
cd frontend
npm install
npm run dev
```

빌드:

```bash
npm run build
```

기본 개발 서버:

- `http://localhost:5173`

백엔드 API 서버:

- `http://localhost:8080`

## 라우팅 구조

```text
/login                         일반 회원/메이드 로그인
/signup                        일반 회원/메이드 회원가입
/                              홈, 카페 목록
/cafe/:id                      카페 상세
/community                     커뮤니티
/mypage                        마이페이지
/maid/profile                  메이드 프로필 관리
/maid/invitations              메이드 초대 목록
/maid/feed/:profileId          메이드 피드
/admin                         관리자 로그인
/admin/dashboard               관리자 카페 관리로 리다이렉트
/admin/cafe-management         관리자 카페 관리
```

`/`, `/cafe/:id`, `/community`, `/mypage`, `/maid/*` 경로는 `ProtectedRoute`를 통해 로그인 상태를 확인합니다. `/maid/*` 경로는 메이드 권한(`ROLE_MAID` 또는 `MAID`)만 접근할 수 있습니다.

## 폴더 구조

```text
frontend/
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── vite.config.ts
├── default_shadcn_theme.css
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx
    │   ├── routes.tsx
    │   ├── api/
    │   │   ├── articleApi.ts
    │   │   ├── authApi.ts
    │   │   ├── cafeApi.ts
    │   │   ├── feedApi.ts
    │   │   └── maidApi.ts
    │   ├── data/
    │   │   ├── cafes.json
    │   │   ├── communityPosts.json
    │   │   └── maidProfiles.json
    │   ├── layouts/
    │   │   ├── AdminLayout.tsx
    │   │   └── MainLayout.tsx
    │   ├── pages/
    │   │   ├── HomePage.tsx
    │   │   ├── LoginPage.tsx
    │   │   ├── SignupPage.tsx
    │   │   ├── CafeDetailPage.tsx
    │   │   ├── CommunityPage.tsx
    │   │   ├── MaidProfilePage.tsx
    │   │   ├── MaidInvitationsPage.tsx
    │   │   ├── MaidFeedPage.tsx
    │   │   ├── MyPage.tsx
    │   │   ├── NotFoundPage.tsx
    │   │   └── admin/
    │   │       ├── AdminLoginPage.tsx
    │   │       ├── AdminDashboardPage.tsx
    │   │       └── AdminCafeManagementPage.tsx
    │   ├── routes/
    │   │   └── ProtectedRoute.tsx
    │   └── components/
    │       ├── auth/
    │       ├── figma/
    │       └── ui/
    └── styles/
        ├── fonts.css
        ├── globals.css
        ├── index.css
        ├── tailwind.css
        └── theme.css
```

## 주요 구현 내용

- `src/app/routes.tsx`: 사용자, 메이드, 관리자 라우트 정의
- `src/app/routes/ProtectedRoute.tsx`: 로그인 여부와 메이드 권한 검사
- `src/app/api/authApi.ts`: 일반 회원, 메이드, 관리자 인증 및 토큰 처리
- `src/app/api/cafeApi.ts`: 홈 카페 목록, 카페 상세 조회
- `src/app/api/articleApi.ts`: 커뮤니티 게시글 API 연동
- `src/app/api/feedApi.ts`: 메이드 피드 API 연동
- `src/app/api/maidApi.ts`: 메이드 프로필 및 초대 API 연동
- `src/app/layouts/MainLayout.tsx`: 일반 사용자 영역 공통 레이아웃
- `src/app/layouts/AdminLayout.tsx`: 관리자 영역 공통 레이아웃

## API 프록시 설정

`vite.config.ts`에서 다음 경로를 백엔드로 전달합니다.

```ts
server: {
  proxy: {
    "/api": "http://localhost:8080",
    "/auth": "http://localhost:8080",
    "/oauth": "http://localhost:8080",
  },
}
```

따라서 프론트엔드 코드에서는 `fetch("/api/...")`, `fetch("/auth/...")`처럼 상대 경로로 API를 호출합니다.

## 인증 흐름

- 일반 회원 로그인: `POST /auth/login`
- 일반 회원 회원가입: `POST /auth/sign-up`
- 메이드 로그인: `POST /api/maids/login`
- 메이드 회원가입: `POST /api/maids/signup`
- 관리자 로그인: `POST /api/admin/v1/login`
- 토큰 재발급: `POST /auth/reissue`

로그인 성공 시 access token과 refresh token을 저장하고, 보호 라우트 접근 시 토큰 존재 여부와 권한 정보를 확인합니다.
