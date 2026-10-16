#!/usr/bin/env node
// 콘텐츠 JSON 검사: npm run check:content
// 1) 모양 검사 (5단계 순서, 퀴즈 정답 번호, 아이콘 이름 등)
// 2) 수준별 글 분량 상한 (PRD 6절)
// 3) 쓰지 않는 표현 (AI문체)
// 문제가 있으면 파일과 위치를 알려 주고 실패 코드(1)로 끝낸다.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const CONTENT_DIR = join(ROOT, "content");

// ---- 수준별 상한 (글자 수는 공백 포함) ----
const LIMITS = {
  L1: { sentences: 2, sentenceChars: 20, cardChars: 40, needIcon: true },
  L2: { sentences: 3, sentenceChars: 30, cardChars: 80 },
  L3: { sentences: 5, sentenceChars: 50, cardChars: 150 },
  L4: { sentences: 3, sentenceChars: 30, cardChars: 80 },
};

// ---- 쓰지 않는 표현 ----
const BANNED = [
  [/[을를] 통해/, "번역투: '~를 통해' → 'AI로'처럼"],
  [/에 있어서/, "번역투: '~에 있어서'"],
  [/에 의해/, "번역투: '~에 의해'"],
  [/[이가] 가능합니다|[이가] 가능해요/, "명사화: '~이 가능해요' → '~할 수 있어요'"],
  [/[이가] 필요합니다|[이가] 필요해요/, "명사화: '~이 필요해요' → '~해 봐요'"],
  [/것이 중요합니다|것이 중요해요/, "'~하는 것이 중요해요' → '꼭 ~해요'"],
  [/알아보겠습니다|살펴보겠습니다|알아볼게요|살펴볼게요/, "예고문: 지우고 바로 본론"],
  [/꾸준히 실천|도움이 되었길|도움이 되셨/, "교훈형 마무리"],
  [/여정|생태계|인사이트|혁신적/, "막연한 유행어"],
  [/한마디로|핵심은/, "상투어"],
  [/(^|\s)바로\s/, "상투어 '바로' (자문자답·강조)"],
  [/훌륭한 질문|좋은 질문이에요!/, "첫머리 칭찬"],
  [/\*\*|—|✨/, "볼드·대시·이모지 남용"],
  [/\p{Extended_Pictographic}/u, "이모지"],
  [/\?\s*(바로|그것은|정답은)/, "자문자답"],
];

// ---- 아이콘 목록은 lib/icons.ts 에서 읽는다 ----
function loadIconNames() {
  const src = readFileSync(join(ROOT, "lib/icons.ts"), "utf8");
  const m = src.match(/\/\/ ICONS-START([\s\S]*?)\/\/ ICONS-END/);
  if (!m) throw new Error("lib/icons.ts 에서 ICONS-START/END 표시를 찾지 못했어요.");
  return new Set(m[1].split(/[\s,]+/).filter(Boolean));
}
const ICON_NAMES = loadIconNames();

const STEP_TYPES = ["intro", "explain", "practice", "quiz", "wrap"];
const problems = [];
let fileCount = 0;

const len = (s) => [...s].length;
const sentences = (text) =>
  text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

function report(file, where, msg) {
  problems.push(`${file} › ${where}\n    ${msg}`);
}

// 글 하나(한 덩어리)를 검사한다. maxSentences 가 0 이면 문장 수는 보지 않는다.
function checkText(file, where, text, lim, { maxSentences = lim.sentences, maxChars } = {}) {
  if (typeof text !== "string" || !text.trim()) {
    report(file, where, "글이 비어 있어요.");
    return;
  }
  const ss = sentences(text);
  if (maxSentences && ss.length > maxSentences) {
    report(file, where, `문장 ${ss.length}개 (상한 ${maxSentences}개): "${ss.join(" / ")}"`);
  }
  for (const s of ss) {
    if (len(s) > lim.sentenceChars) {
      report(file, where, `문장 ${len(s)}자 (상한 ${lim.sentenceChars}자): "${s}"`);
    }
  }
  if (maxChars && len(text) > maxChars) {
    report(file, where, `전체 ${len(text)}자 (상한 ${maxChars}자)`);
  }
  for (const s of ss) {
    for (const [re, why] of BANNED) {
      if (re.test(s)) report(file, where, `쓰지 않는 표현 - ${why}: "${s}"`);
    }
  }
}

function checkIcon(file, where, name, lim) {
  if (name === undefined) {
    if (lim.needIcon) report(file, where, "L1은 모든 글에 그림(icon)이 있어야 해요.");
    return;
  }
  if (!ICON_NAMES.has(name)) report(file, where, `없는 아이콘 "${name}". lib/icons.ts 에 더해 주세요.`);
}

function checkUnit(path) {
  const file = relative(ROOT, path);
  let data;
  try {
    data = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    report(file, "JSON", `읽을 수 없어요: ${e.message}`);
    return;
  }

  // 경로와 내용이 맞는지: content/L2/unit-01.json → L2, 1
  const m = file.match(/content\/(L[1-4])\/unit-(\d{2})\.json$/);
  if (!m) return report(file, "파일 이름", "content/L1~L4/unit-01.json 꼴이어야 해요.");
  const [, level, unitStr] = m;
  if (data.level !== level) report(file, "level", `폴더는 ${level}인데 level 값은 ${data.level}이에요.`);
  if (data.unit !== Number(unitStr)) report(file, "unit", `파일 이름은 ${Number(unitStr)}단원인데 unit 값은 ${data.unit}이에요.`);

  const lim = LIMITS[level];
  if (!data.title) report(file, "title", "단원 제목이 없어요.");

  const steps = data.steps;
  if (!Array.isArray(steps) || steps.length !== 5) {
    return report(file, "steps", "단계가 정확히 5개여야 해요 (열기·알아보기·해 보기·확인 퀴즈·정리).");
  }
  steps.forEach((s, i) => {
    if (s.type !== STEP_TYPES[i]) report(file, `steps[${i}]`, `${i + 1}단계는 "${STEP_TYPES[i]}"여야 해요. 지금: "${s.type}"`);
  });

  const [intro, explain, practice, quiz, wrap] = steps;
  const at = (i, rest = "") => `${i + 1}단계 ${STEP_TYPES[i]}${rest}`;

  // 1 열기: body 전체가 한 화면
  checkText(file, at(0, " title"), intro.title, lim, { maxSentences: 0 });
  checkText(file, at(0, " body"), (intro.body ?? []).join("\n"), lim);
  checkIcon(file, at(0, " icon"), intro.icon, lim);

  // 2 알아보기: 카드 한 장이 한 화면
  checkText(file, at(1, " title"), explain.title, lim, { maxSentences: 0 });
  if (!explain.cards?.length) report(file, at(1), "카드가 한 장 이상 있어야 해요.");
  (explain.cards ?? []).forEach((c, i) => {
    checkText(file, at(1, ` 카드${i + 1} title`), c.title, lim, { maxSentences: 0 });
    checkText(file, at(1, ` 카드${i + 1} body`), c.body, lim, { maxChars: lim.cardChars });
    checkIcon(file, at(1, ` 카드${i + 1} icon`), c.icon, lim);
    if (c.more && level !== "L3") report(file, at(1, ` 카드${i + 1} more`), "'더 보기'는 L3에서만 써요.");
  });

  // 3 해 보기
  checkText(file, at(2, " title"), practice.title, lim, { maxSentences: 0 });
  checkText(file, at(2, " guide"), practice.guide, lim);
  const wantMode = { L1: "cards", L2: "blocks", L3: "chat", L4: "chat" }[level];
  if (practice.mode !== wantMode) report(file, at(2, " mode"), `${level}은 "${wantMode}" 방식이에요. 지금: "${practice.mode}"`);

  if (practice.mode === "cards") {
    if (!practice.cards?.length) report(file, at(2), "그림 카드가 없어요.");
    const ids = new Set();
    (practice.cards ?? []).forEach((c, i) => {
      if (!c.id || ids.has(c.id)) report(file, at(2, ` 카드${i + 1}`), "id가 없거나 겹쳐요.");
      ids.add(c.id);
      checkText(file, at(2, ` 카드${i + 1} label`), c.label, lim, { maxSentences: 0 });
      checkText(file, at(2, ` 카드${i + 1} answer`), c.answer, lim);
      checkIcon(file, at(2, ` 카드${i + 1} icon`), c.icon, { ...lim, needIcon: true });
    });
  }

  if (practice.mode === "blocks") {
    const slots = practice.slots ?? [];
    if (!slots.length) report(file, at(2), "질문 블록 칸이 없어요.");
    slots.forEach((slot, si) => {
      checkText(file, at(2, ` 칸${si + 1} label`), slot.label, lim, { maxSentences: 0 });
      (slot.options ?? []).forEach((o, oi) =>
        checkText(file, at(2, ` 칸${si + 1} 블록${oi + 1}`), o.label, lim, { maxSentences: 0 }),
      );
    });
    const answers = practice.answers ?? {};
    for (const [k, v] of Object.entries(answers)) checkText(file, at(2, ` 답 "${k}"`), v, lim);
    if (!answers["기본"]) report(file, at(2, " answers"), '"기본" 답이 있어야 해요.');

    // 모든 조합에 맞는 답이 있는지 (없으면 "기본"으로 떨어진다)
    const combos = slots.reduce((acc, s) => acc.flatMap((a) => (s.options ?? []).map((o) => [...a, o.id])), [[]]);
    const keys = Object.keys(answers).map((k) => k.split("+"));
    const missing = combos.filter(
      (c) => !keys.some((parts) => parts.length === c.length && parts.every((p, i) => p === "*" || p === c[i])),
    );
    if (missing.length) {
      report(file, at(2, " answers"), `답이 없는 조합 ${missing.length}개 (기본 답이 나가요): ${missing.map((c) => c.join("+")).join(", ")}`);
    }
  }

  if (practice.mode === "chat") {
    (practice.examples ?? []).forEach((ex, i) => checkText(file, at(2, ` 예시${i + 1}`), ex, lim));
  }

  // 4 확인 퀴즈
  if (!quiz.items?.length) report(file, at(3), "문항이 없어요.");
  (quiz.items ?? []).forEach((it, i) => {
    const w = (x) => at(3, ` 문항${i + 1} ${x}`);
    checkText(file, w("q"), it.q, lim);
    if (!Array.isArray(it.choices) || it.choices.length < 2) report(file, w("choices"), "보기가 2개 이상이어야 해요.");
    (it.choices ?? []).forEach((c, ci) => checkText(file, w(`보기${ci + 1}`), c, lim, { maxSentences: 1 }));
    if (!Number.isInteger(it.answer) || it.answer < 0 || it.answer >= (it.choices?.length ?? 0)) {
      report(file, w("answer"), `정답 번호 ${it.answer}가 보기 범위를 벗어나요 (0부터 셉니다).`);
    }
    checkText(file, w("explain"), it.explain, lim);
  });

  // 5 정리: 2~3줄
  checkText(file, at(4, " title"), wrap.title, lim, { maxSentences: 0 });
  const points = wrap.points ?? [];
  if (points.length < 1 || points.length > 3) report(file, at(4, " points"), `배운 것은 1~3줄이에요. 지금 ${points.length}줄`);
  checkText(file, at(4, " points"), points.join("\n"), lim);

  // 연습 모드 답
  if (!data.fallbackAnswers?.["기본"]) report(file, "fallbackAnswers", '"기본" 연습 답이 있어야 해요.');
  for (const [k, v] of Object.entries(data.fallbackAnswers ?? {})) checkText(file, `fallbackAnswers "${k}"`, v, lim);
}

// ---- 실행 ----
if (!existsSync(CONTENT_DIR)) {
  console.error("content 폴더가 없어요.");
  process.exit(1);
}
for (const dir of readdirSync(CONTENT_DIR, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  for (const f of readdirSync(join(CONTENT_DIR, dir.name))) {
    if (!f.endsWith(".json")) continue;
    fileCount++;
    checkUnit(join(CONTENT_DIR, dir.name, f));
  }
}

if (problems.length) {
  console.log(`콘텐츠 검사: 파일 ${fileCount}개, 고칠 곳 ${problems.length}곳\n`);
  console.log(problems.join("\n\n"));
  process.exit(1);
}
console.log(`콘텐츠 검사 통과: 파일 ${fileCount}개`);
