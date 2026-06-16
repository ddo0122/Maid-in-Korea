# Maid-in-Korea Backend

Maid-in-Korea 백엔드는 메이드 카페 정보, 회원/메이드/관리자 인증, 카페 운영 정보, 메이드 프로필, 피드, 커뮤니티 게시글을 처리하는 Spring Boot API 서버입니다.

모든 주요 응답은 `ApiResponse` 공통 포맷으로 감싸서 반환하며, JWT 기반 인증과 Spring Security 권한 검사를 사용합니다.

## 기술 스택

- Java 21
- Spring Boot 4.0.6
- Spring MVC
- Spring Security
- Spring Data JPA
- Bean Validation
- MySQL
- Redis
- JWT
- OAuth2 Client, Kakao OAuth
- Lombok
- Springdoc OpenAPI / Swagger
- Gradle

## 실행 방법

```bash
cd backend
./gradlew bootRun
```

테스트:

```bash
./gradlew test
```

빌드:

```bash
./gradlew build
```

기본 서버 주소:

- API 서버: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

## 환경 변수

`src/main/resources/application.yml`은 다음 환경 변수를 사용합니다.

```bash
DB_URL=jdbc:mysql://localhost:3306/{database_name}
DB_USER={mysql_user}
DB_PW={mysql_password}

JWT_SECRET_KEY={jwt_secret_key}

KAKAO_REST_API_KEY={kakao_rest_api_key}
KAKAO_REST_API_SECRET={kakao_rest_api_secret}

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

Redis 관련 환경 변수는 기본값이 있어 로컬 기본 설정(`localhost:6379`)으로도 실행할 수 있습니다. MySQL, JWT, Kakao OAuth 값은 별도로 지정해야 합니다.

## 폴더 구조

```text
backend/
├── build.gradle
├── settings.gradle
├── gradlew
├── gradlew.bat
└── src/
    ├── main/
    │   ├── java/com/example/backend/
    │   │   ├── BackendApplication.java
    │   │   ├── domain/
    │   │   │   ├── admin/
    │   │   │   ├── article/
    │   │   │   ├── cafe/
    │   │   │   ├── feed/
    │   │   │   ├── maid/
    │   │   │   └── member/
    │   │   └── global/
    │   │       ├── apiPayload/
    │   │       ├── common/
    │   │       ├── config/
    │   │       └── security/
    │   └── resources/
    │       ├── application.yml
    │       └── db/
    │           └── seed-cafes.sql
    └── test/
        └── java/com/example/backend/
```

## 도메인 역할

- `domain/member`: 일반 회원 가입, 로그인, 회원 정보 조회/수정/삭제
- `domain/maid`: 메이드 회원 인증, 메이드 프로필, 카페 초대 처리
- `domain/admin`: 관리자 로그인, 관리자 카페 관리, 메뉴/스케줄/초대 관리
- `domain/cafe`: 카페 홈 목록, 상세 정보, 월별 스케줄 조회
- `domain/feed`: 메이드 피드 작성, 조회, 수정, 삭제
- `domain/article`: 커뮤니티 게시글 작성, 조회, 수정, 삭제
- `global/security`: JWT 인증 필터, OAuth, 사용자 인증 객체, 예외 핸들러
- `global/apiPayload`: 공통 응답 포맷과 성공/에러 코드
- `global/common`: 공통 엔티티, 페이지네이션 DTO

## API 요약

### 인증 / 회원

| Method | Path | 설명 |
| --- | --- | --- |
| `POST` | `/auth/sign-up` | 일반 회원가입 |
| `POST` | `/auth/login` | 일반 회원 로그인 |
| `POST` | `/auth/reissue` | refresh token 기반 토큰 재발급 |
| `GET` | `/auth/v2/members/me` | 내 회원 정보 조회 |
| `PATCH` | `/auth/v1/members/update` | 내 회원 정보 수정 |
| `DELETE` | `/auth/v1/members/delete` | 회원 탈퇴 |

### 메이드

| Method | Path | 설명 |
| --- | --- | --- |
| `POST` | `/api/maids/signup` | 메이드 회원가입 |
| `POST` | `/api/maids/login` | 메이드 로그인 |
| `POST` | `/api/maids/v1/profiles` | 메이드 프로필 생성 |
| `GET` | `/api/maids/v1/profiles` | 내 메이드 프로필 목록 조회 |
| `PATCH` | `/api/maids/v1/profiles?profileId={id}` | 메이드 프로필 수정 |
| `DELETE` | `/api/maids/v1/profiles?profileId={id}` | 메이드 프로필 삭제 |
| `PATCH` | `/api/maids/v1/profiles/deactivate?profileId={id}` | 메이드 프로필 비활성화 |
| `GET` | `/api/maids/v1/invitations` | 받은 카페 초대 목록 조회 |
| `PATCH` | `/api/maids/v1/invitations/{invitationId}?status={true/false}` | 카페 초대 수락/거절 |

### 카페

| Method | Path | 설명 |
| --- | --- | --- |
| `GET` | `/api/cafes/v1/home` | 홈 카페 목록 조회 |
| `GET` | `/api/cafes/v1/{cafeId}` | 카페 상세 조회 |
| `GET` | `/api/cafes/v1/{cafeId}/monthly-schedules?year={year}&month={month}` | 공개된 월별 스케줄 조회 |

### 관리자

| Method | Path | 설명 |
| --- | --- | --- |
| `POST` | `/api/admin/v1/login` | 관리자 로그인 |
| `GET` | `/api/admin/v1/me` | 관리자 정보 조회 |
| `PATCH` | `/api/admin/cafes/v1/update` | 관리자 카페 정보 수정 |
| `GET` | `/api/admin/cafes/v1/monthly-schedules?year={year}&month={month}` | 관리자 월별 스케줄 조회 |
| `POST` | `/api/admin/cafes/v1/monthly-schedules` | 월별 스케줄 임시 저장 |
| `PATCH` | `/api/admin/cafes/v1/monthly-schedules/{scheduleId}` | 월별 스케줄 수정 |
| `POST` | `/api/admin/cafes/v1/monthly-schedules/{scheduleId}/publish` | 월별 스케줄 발행 |
| `POST` | `/api/admin/cafes/v1/menus` | 메뉴 등록 |
| `PATCH` | `/api/admin/cafes/v1/menus?id={menuId}` | 메뉴 수정 |
| `DELETE` | `/api/admin/cafes/v1/menus?id={menuId}` | 메뉴 삭제 |
| `GET` | `/api/admin/maids/v1/invitations` | 보낸 메이드 초대 목록 조회 |
| `POST` | `/api/admin/maids/v1/invitation?id={maidProfileId}` | 메이드 초대 발송 |

### 피드

| Method | Path | 설명 |
| --- | --- | --- |
| `POST` | `/api/feeds/v1/create` | 메이드 피드 작성 |
| `GET` | `/api/feeds/v1/getFeed/{maidProfileId}` | 메이드 프로필 피드 조회 |
| `PATCH` | `/api/feeds/v1?id={feedId}` | 메이드 피드 수정 |
| `DELETE` | `/api/feeds/v1?id={feedId}` | 메이드 피드 삭제 |

### 커뮤니티 게시글

| Method | Path | 설명 |
| --- | --- | --- |
| `POST` | `/api/articles/v1` | 게시글 작성 |
| `GET` | `/api/articles/v1?cursor={cursor}&size={size}` | 게시글 목록 조회 |
| `PATCH` | `/api/articles/v1?id={articleId}` | 게시글 수정 |
| `DELETE` | `/api/articles/v1?id={articleId}` | 게시글 삭제 |

## 인증과 권한

Spring Security 설정에서 다음 경로는 인증 없이 접근할 수 있습니다.

- `/auth/sign-up`
- `/auth/login`
- `/auth/reissue`
- `/oauth/authorize/**`
- `/oauth/callback/**`
- `/login/oauth2/code/**`
- `/api/maids/login`
- `/api/maids/signup`
- `/api/admin/v1/login`
- `/api/cafes/v1/home`
- `/api/cafes/v1/*`
- Swagger 관련 경로

그 외 경로는 JWT 인증이 필요합니다. `/admin/**`, `/api/admin/**` 경로는 관리자 권한(`ROLE_ADMIN`)이 필요합니다.

## 응답 포맷

컨트롤러는 공통적으로 `ApiResponse` 형식을 반환합니다.

```json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "요청에 성공했습니다.",
  "result": {}
}
```

도메인별 성공/에러 코드는 각 도메인의 `exception/code` 패키지에서 관리합니다.
