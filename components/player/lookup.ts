// L2 질문 블록 조합으로 미리 만든 답을 찾는다.
// 1) 정확히 같은 조합 2) "*"(아무거나)가 섞인 조합 3) "기본" 순서로 찾는다.
export function findBlockAnswer(
  answers: Record<string, string>,
  picked: string[],
  fallback: string,
): string {
  const exact = answers[picked.join("+")];
  if (exact) return exact;

  // "*" 가 적게 들어간 키부터 맞춰 본다
  const keys = Object.keys(answers)
    .map((k) => ({ k, parts: k.split("+") }))
    .filter(({ parts }) => parts.length === picked.length)
    .sort((a, b) => count(a.parts) - count(b.parts));

  for (const { k, parts } of keys) {
    if (parts.every((p, i) => p === "*" || p === picked[i])) return answers[k];
  }
  return answers["기본"] ?? fallback;
}

const count = (parts: string[]) => parts.filter((p) => p === "*").length;
