// 학습 수준(L1~L4) 설정. 화면 글자 크기, 터치 영역, 연습 AI 방식을 한곳에서 정한다.

export const LEVELS = ["L1", "L2", "L3", "L4"] as const;
export type Level = (typeof LEVELS)[number];

export type LevelInfo = {
  code: Level;
  name: string; // 수준 이름
  short: string; // 카드 한 줄 설명
  icon: string; // lib/icons.ts 에 있는 이름
  practice: "cards" | "blocks" | "chat"; // 해 보기 방식
};

export const LEVEL_INFO: Record<Level, LevelInfo> = {
  L1: { code: "L1", name: "초등 1~2학년", short: "그림을 보며 AI를 만나요", icon: "Smile", practice: "cards" },
  L2: { code: "L2", name: "초등 3~6학년", short: "질문을 만들어 AI와 이야기해요", icon: "Backpack", practice: "blocks" },
  L3: { code: "L3", name: "중고생·성인", short: "공부와 일에 AI를 써 봐요", icon: "Laptop", practice: "chat" },
  L4: { code: "L4", name: "어르신", short: "큰 글씨로 천천히 배워요", icon: "Glasses", practice: "chat" },
};

export function isLevel(v: string): v is Level {
  return (LEVELS as readonly string[]).includes(v);
}

// 단원 이름. 내용이 없는 단원도 목록에 보여 주려고 따로 둔다.
export const UNIT_TITLES = [
  "AI를 만나요",
  "AI에게 말 걸기",
  "AI 답 확인하기",
  "안전하게 쓰기",
  "생활에 쓰기",
  "AI로 만들어 보기",
] as const;

// MVP에서 목록에 보이는 단원 수 (1~3단원)
export const MVP_UNITS = 3;
