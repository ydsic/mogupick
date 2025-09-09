# Next.js App (TypeScript)

## 🛠️ Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Code Quality: ESLint + Prettier
- Package Manager: npm

## ✅ Setup Summary (2025-08-12)

- ESLint Flat Config 전환: `eslint.config.js` (FlatCompat로
  `next/core-web-vitals`, `prettier` 확장)
- 규칙 강화: TypeScript 엄격 규칙, import 정렬/중복 방지, unused-imports, a11y,
  React 규칙
- Prettier 설정 적용: `.prettierrc` + 스크립트(`format`, `format:check`)

### 📦 Installed Dev Dependencies

- @eslint/js, eslint-config-prettier
- @typescript-eslint/parser, @typescript-eslint/eslint-plugin
- eslint-plugin-react, eslint-plugin-react-hooks
- eslint-plugin-jsx-a11y, eslint-plugin-import,
  eslint-import-resolver-typescript
- eslint-plugin-unused-imports
- prettier, prettier-plugin-tailwindcss

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # 전역 스타일
│   ├── layout.tsx       # 루트 레이아웃
│   ├── page.tsx         # 홈페이지 (/)
├── components/          # 재사용 가능한 컴포넌트
```

## 🔌 Scripts

```bash
npm run dev           # 개발 서버
npm run build         # 프로덕션 빌드
npm run start         # 프로덕션 실행
npm run lint          # ESLint 검사
npm run format        # Prettier 포맷팅
npm run format:check  # 포맷팅 검사
npm run clean         # 캐시 삭제 후, npm i
```

## 🔧 Code Quality Tools

- TypeScript: `strict-boolean-expressions`, `no-explicit-any` 등 엄격 규칙
- React: `jsx-key`, `no-unstable-nested-components` 등 최적화 규칙
- Import: 자동 정렬 및 중복/순환 감지
- Accessibility: JSX a11y 규칙

## 🌍 Environment Setup

### 환경변수 설정

1. 개발환경: `.env.local` 파일을 생성하여 다음 변수들을 설정하세요:

```bash
# API Base URL
NEXT_PUBLIC_BASE_URL=http://your-api-server.com:8080/api/v1
NEXT_PUBLIC_OAUTH_BASE_URL=http://your-oauth-server.com

# NextAuth 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# OAuth 클라이언트 정보
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret
```

2. 배포환경: 배포 플랫폼에서 다음 환경변수들을 설정하세요:
   - `NEXT_PUBLIC_BASE_URL`: HTTPS API 서버 URL
   - `NEXT_PUBLIC_OAUTH_BASE_URL`: HTTPS OAuth 서버 URL
   - 기타 인증 관련 환경변수들

> ⚠️ **중요**: 배포환경에서는 반드시 HTTPS를 사용하세요!

## ⚠️ Troubleshooting
