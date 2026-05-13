# Frontend

## 프로젝트 소개

> 이 프로젝트는 사용자에게 웹 기반 인터페이스를 제공하는 프론트엔드 애플리케이션입니다.
> 사용자는 웹 화면을 통해 데이터를 조회하고, 입력하며, 백엔드 API와 통신하여 서비스를 이용할 수 있습니다.

## 기술 스택

- React
- Typescript
- React Router
- TailwindCSS
- Redux

## 폴더 구조

```text
frontend/
├── index.html                 # Vite 애플리케이션 진입 HTML
├── package.json               # 프론트엔드 의존성 및 실행 스크립트
├── package-lock.json          # npm 의존성 잠금 파일
├── pnpm-workspace.yaml        # pnpm 워크스페이스 설정
├── postcss.config.mjs         # PostCSS 설정
├── vite.config.ts             # Vite 빌드 및 개발 서버 설정
├── default_shadcn_theme.css   # shadcn/ui 기본 테마 스타일
└── src/
    ├── main.tsx               # React 애플리케이션 렌더링 진입점
    ├── app/
    │   ├── App.tsx            # 앱 루트 컴포넌트
    │   ├── routes.tsx         # React Router 라우트 정의
    │   ├── layouts/           # 공통 화면 레이아웃
    │   │   ├── MainLayout.tsx
    │   │   └── AdminLayout.tsx
    │   ├── pages/             # 라우트 단위 페이지 컴포넌트
    │   │   ├── HomePage.tsx
    │   │   ├── LoginPage.tsx
    │   │   ├── SignupPage.tsx
    │   │   ├── CafeDetailPage.tsx
    │   │   ├── CommunityPage.tsx
    │   │   ├── MaidFeedPage.tsx
    │   │   ├── MaidProfilePage.tsx
    │   │   ├── NotFoundPage.tsx
    │   │   └── admin/         # 관리자 페이지
    │   │       ├── AdminDashboardPage.tsx
    │   │       ├── AdminLoginPage.tsx
    │   │       └── AdminCafeManagementPage.tsx
    │   └── components/        # 재사용 UI 컴포넌트
    │       ├── figma/         # Figma에서 가져온 보조 컴포넌트
    │       └── ui/            # shadcn/ui 기반 공통 UI 컴포넌트
    └── styles/                # 전역 스타일 및 Tailwind 관련 스타일
        ├── fonts.css
        ├── globals.css
        ├── index.css
        ├── tailwind.css
        └── theme.css
```

### 주요 디렉터리 역할

- `src/main.tsx`: 브라우저 DOM에 React 앱을 마운트하는 시작점입니다.
- `src/app/App.tsx`: 앱 전체의 최상위 컴포넌트입니다.
- `src/app/routes.tsx`: 사용자 페이지와 관리자 페이지의 라우팅을 정의합니다.
- `src/app/layouts`: 여러 페이지에서 공유하는 레이아웃 컴포넌트를 관리합니다.
- `src/app/pages`: URL 경로와 직접 연결되는 페이지 컴포넌트를 관리합니다.
- `src/app/components`: 페이지 내부에서 재사용하는 컴포넌트를 관리합니다.
- `src/styles`: TailwindCSS, 테마, 폰트, 전역 CSS를 관리합니다.
