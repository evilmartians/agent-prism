/**
 * Short, human-readable model label for the ModelBadge (e.g. `claude-opus-4-8` →
 * "Opus 4.8"). Claude families are parsed by VERSION rather than a hardcoded
 * per-release ladder, so new releases (4.7, 4.8, 5.x, …) render correctly without
 * a code change — the previous lookup only knew 4.5/4.6 and silently degraded
 * `claude-opus-4-8` to "Opus 4".
 */

const CLAUDE_FAMILIES = ["opus", "sonnet", "haiku"] as const;

/**
 * The `major[.minor]` version next to a Claude family token, in either id order:
 *   `claude-opus-4-8` / `claude-opus-4.8`          → "4.8" (version AFTER family)
 *   `claude-3-5-sonnet-20241022` / `claude-4-opus` → "3.5" / "4" (version BEFORE)
 * A trailing date or tag suffix (`-20251001`, `[1m]`) is ignored. "" when none.
 */
function claudeVersion(model: string, family: string): string {
  // Version components are 1-2 digits, each NOT followed by another digit (`(?!\d)`)
  // so an 8-digit date suffix (`claude-opus-4-20250514`) can't be mistaken for a
  // version. The separator before the version is mandatory so `opus48` doesn't fuse.
  const V = "(\\d{1,2})(?!\\d)";

  // "version-before-family" first (`claude-3-5-sonnet`), so a trailing date on the
  // new family-first ids never wins. The leading `(?<!\d)` gives the version a
  // clean boundary so a date placed BEFORE the family (`claude-20250514-opus`)
  // can't have its tail (`14-opus`) misread as "Opus 14".
  const before = model.match(new RegExp(`(?<!\\d)${V}(?:[-.]${V})?[-.]${family}`));

  if (before) return before[2] ? `${before[1]}.${before[2]}` : before[1];

  const after = model.match(new RegExp(`${family}[-.]${V}(?:[-.]${V})?`));

  if (after) return after[2] ? `${after[1]}.${after[2]}` : after[1];

  return "";
}

export function getShortModelName(model: unknown): string {
  // Defensive: the badge takes model from untrusted span attributes, so the
  // input is typed `unknown` and narrowed here rather than trusted as a string.
  if (typeof model !== "string" || model === "") return "";

  const family = CLAUDE_FAMILIES.find((candidate) => model.includes(candidate));

  if (family !== undefined) {
    const label = family.charAt(0).toUpperCase() + family.slice(1);
    const version = claudeVersion(model, family);

    return version === "" ? label : `${label} ${version}`;
  }

  // GPT / Gemini: parse an optional dotted minor version so `gpt-4.1` and
  // `gemini-2.5-pro` keep their minor instead of collapsing to the major.
  if (model.includes("gpt")) {
    // `gpt-4o` is a model name ("omni"), not a "4.o" version — special-cased.
    if (model.includes("gpt-4o")) return "GPT-4o";

    const gpt = model.match(/gpt-(\d{1,2})(?:\.(\d{1,2}))?/);

    if (gpt) return gpt[2] ? `GPT-${gpt[1]}.${gpt[2]}` : `GPT-${gpt[1]}`;

    return "GPT";
  }

  if (model.includes("gemini")) {
    const gemini = model.match(/gemini-(\d{1,2})(?:\.(\d{1,2}))?/);

    if (gemini) {
      return gemini[2] ? `Gemini ${gemini[1]}.${gemini[2]}` : `Gemini ${gemini[1]}`;
    }

    return "Gemini";
  }

  const parts = model.split("-");

  if (parts.length >= 2) {
    return parts.slice(0, 2).join(" ");
  }

  return model;
}
