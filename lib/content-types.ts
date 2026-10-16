// 단원 콘텐츠 JSON의 모양. content/L?/unit-0?.json 이 이 모양을 따른다.
import type { Level } from "./levels";

export type IntroStep = {
  type: "intro";
  title: string;
  body: string[]; // 한 줄에 한 문장
  icon?: string;
};

export type ExplainCard = {
  title: string;
  body: string;
  icon?: string;
  more?: string; // L3에서 "더 보기"로 접어 둘 내용
};

export type ExplainStep = {
  type: "explain";
  title: string;
  cards: ExplainCard[]; // 카드 한 장 = 한 화면
};

// L1: 그림 카드 하나를 고르면 미리 만든 답을 보여 준다.
export type CardsPractice = {
  type: "practice";
  mode: "cards";
  title: string;
  guide: string;
  cards: { id: string; label: string; icon: string; answer: string }[];
};

// L2: 질문 블록을 칸마다 하나씩 골라 조립한다.
// answers 키는 칸 순서대로 고른 id를 "+"로 이은 것. 칸 자리에 "*"를 쓰면 무엇을 골라도 맞는다.
export type BlocksPractice = {
  type: "practice";
  mode: "blocks";
  title: string;
  guide: string;
  slots: { id: string; label: string; options: { id: string; label: string }[] }[];
  suffix?: string; // 조립한 질문 끝에 붙는 말 (예: "알려 줘.")
  answers: Record<string, string>;
};

// L3·L4: 자유 입력. 실제 AI 연결 전에는 연습 답변으로 보여 준다.
export type ChatPractice = {
  type: "practice";
  mode: "chat";
  title: string;
  guide: string;
  examples: string[]; // 눌러서 바로 넣는 예시 질문
};

export type PracticeStep = CardsPractice | BlocksPractice | ChatPractice;

export type QuizItem = {
  q: string;
  choices: string[];
  answer: number; // choices 안의 정답 순번 (0부터)
  explain: string;
};

export type QuizStep = { type: "quiz"; title: string; items: QuizItem[] };

export type WrapStep = { type: "wrap"; title: string; points: string[] };

export type UnitContent = {
  level: Level;
  unit: number;
  title: string;
  steps: [IntroStep, ExplainStep, PracticeStep, QuizStep, WrapStep];
  fallbackAnswers: Record<string, string>; // 연습 모드 답. "기본" 키는 꼭 있어야 한다
};

export const STEP_LABELS = ["열기", "알아보기", "해 보기", "확인 퀴즈", "정리"] as const;
