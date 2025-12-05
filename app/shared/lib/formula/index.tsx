import TeX from "@matejmazur/react-katex";

const FORMULA_REGEX = /\$(.*?)\$/g;

export function extractFormulas(text: string): string[] {
  const matches = [...text.matchAll(FORMULA_REGEX)];
  return matches.map((match) => match[1]);
}

// 数式部分を置き換え
export function replacePlaceHolder(text: string, placeHolder: string): string {
  return text.replace(FORMULA_REGEX, placeHolder);
}

export function inject2list<T>(
  placedString: string,
  placeHolder: string,
  injections: T[],
): (string | T)[] {
  const parts = placedString.split(placeHolder);
  const result: (string | T)[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] !== "") {
      result.push(parts[i]);
    }
    if (i < injections.length) {
      result.push(injections[i]);
    }
  }

  return result;
}

const FORMULA_PLACE_HOLDER = "^@;";

export function toFormulas(text: string) {
  const extracted = extractFormulas(text);
  const replaced = replacePlaceHolder(text, FORMULA_PLACE_HOLDER);

  const formulas = extracted.map((formula) => (
    <TeX key={formula}>{formula}</TeX>
  ));
  return inject2list(replaced, FORMULA_PLACE_HOLDER, formulas);
}
