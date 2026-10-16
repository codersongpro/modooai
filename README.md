# 모두AI

AI를 처음 접하는 초등 저학년부터 어르신까지 4개 수준(L1~L4) 학습자가 AI를 이해하고, 질문하고, 답을 확인하는 법을 익히는 반응형 웹 코스웨어입니다.

## 시작하기

```bash
npm install
npm run dev          # http://localhost:3000
```

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 배포용 빌드 |
| `npm run lint` | 코드 규칙 검사 |
| `npm run check:content` | 콘텐츠 글 분량·금지 표현·모양 검사 |

## 폴더

```
app/                  화면 (Next.js App Router)
  page.tsx            S-01 첫 화면
  learn/              S-03 수준 선택 → S-04 단원 목록 → S-05 학습 단계
  join/, teacher/     수업 입장·선생님 화면 (다음 단계에서 만듦)
components/           공통 화면 조각
  player/             단원 5단계 진행, 연습 AI, 퀴즈
content/L1~L4/        단원 콘텐츠 JSON (unit-01.json …)
lib/                  수준 설정, 콘텐츠 목록, 기기 저장, 아이콘 목록
scripts/              check-content.mjs
supabase/migrations/  SQL (001_xxx.sql 처럼 번호를 붙여 모음)
```

## 콘텐츠 더하기

1. `content/L2/unit-02.json`처럼 파일을 만든다. 모양은 `lib/content-types.ts`를 따른다.
2. `lib/content.ts`에 한 줄 더한다.
3. `npm run check:content`로 글 분량과 금지 표현을 확인한다.

글자 수는 공백을 포함해 센다. 수준별 상한은 PRD 6절 표를 따른다.

| 수준 | 한 화면 문장 | 한 문장 | 설명 카드 |
|---|---|---|---|
| L1 | 2 | 20자 | 40자 |
| L2 | 3 | 30자 | 80자 |
| L3 | 5 | 50자 | 150자 |
| L4 | 3 | 30자 | 80자 |

## 환경변수

`.env.example`에 이름이 있다. 값은 `.env.local`과 Vercel에만 넣는다. AI 키와 `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용이다.
