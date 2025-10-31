export function hexToRgb(hex: string) {
  let normalized = hex.replace(/^#/, "");

  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }

  const match = normalized.match(/[a-fA-F0-9]{2}/g);
  if (!match || match.length < 3) return "0 0 0";

  const [r, g, b] = match.slice(0, 3).map((c) => parseInt(c, 16));
  return `${r} ${g} ${b}`;
}
