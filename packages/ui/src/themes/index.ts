const prefix = "agentprism";

function token(name: string) {
  return `oklch(var(--${prefix}-${name}) / <alpha-value>)`;
}

export const agentPrismTailwindColors = {
  brand: token("brand"),

  background: token("background"),
  foreground: token("foreground"),

  primary: token("primary"),
  "primary-foreground": token("primary-foreground"),

  secondary: token("secondary"),
  "secondary-foreground": token("secondary-foreground"),

  muted: token("muted"),
  "muted-foreground": token("muted-foreground"),

  accent: token("accent"),
  "accent-foreground": token("accent-foreground"),

  border: token("border"),
  "border-subtle": token("border-subtle"),
  "border-strong": token("border-strong"),
  "border-inverse": token("border-inverse"),

  success: token("success"),
  "success-muted": token("success-muted"),
  "success-muted-foreground": token("success-muted-foreground"),

  error: token("error"),
  "error-muted": token("error-muted"),
  "error-muted-foreground": token("error-muted-foreground"),

  warning: token("warning"),
  "warning-muted": token("warning-muted"),
  "warning-muted-foreground": token("warning-muted-foreground"),

  pending: token("pending"),
  "pending-muted": token("pending-muted"),
  "pending-muted-foreground": token("pending-muted-foreground"),

  "code-string": token("code-string"),
  "code-number": token("code-number"),
  "code-boolean": token("code-boolean"),
  "code-key": token("code-key"),
  "code-base": token("code-base"),

  "badge-default": token("badge-default"),
  "badge-default-foreground": token("badge-default-foreground"),

  "avatar-llm": token("avatar-llm"),
  "badge-llm": token("badge-llm"),
  "badge-llm-foreground": token("badge-llm-foreground"),
  "timeline-llm": token("timeline-llm"),

  "avatar-agent": token("avatar-agent"),
  "badge-agent": token("badge-agent"),
  "badge-agent-foreground": token("badge-agent-foreground"),
  "timeline-agent": token("timeline-agent"),

  "avatar-tool": token("avatar-tool"),
  "badge-tool": token("badge-tool"),
  "badge-tool-foreground": token("badge-tool-foreground"),
  "timeline-tool": token("timeline-tool"),

  "avatar-chain": token("avatar-chain"),
  "badge-chain": token("badge-chain"),
  "badge-chain-foreground": token("badge-chain-foreground"),
  "timeline-chain": token("timeline-chain"),

  "avatar-retrieval": token("avatar-retrieval"),
  "badge-retrieval": token("badge-retrieval"),
  "badge-retrieval-foreground": token("badge-retrieval-foreground"),
  "timeline-retrieval": token("timeline-retrieval"),

  "avatar-embedding": token("avatar-embedding"),
  "badge-embedding": token("badge-embedding"),
  "badge-embedding-foreground": token("badge-embedding-foreground"),
  "timeline-embedding": token("timeline-embedding"),

  "avatar-guardrail": token("avatar-guardrail"),
  "badge-guardrail": token("badge-guardrail"),
  "badge-guardrail-foreground": token("badge-guardrail-foreground"),
  "timeline-guardrail": token("timeline-guardrail"),

  "avatar-create-agent": token("avatar-create-agent"),
  "badge-create-agent": token("badge-create-agent"),
  "badge-create-agent-foreground": token("badge-create-agent-foreground"),
  "timeline-create-agent": token("timeline-create-agent"),

  "avatar-span": token("avatar-span"),
  "badge-span": token("badge-span"),
  "badge-span-foreground": token("badge-span-foreground"),
  "timeline-span": token("timeline-span"),

  "avatar-event": token("avatar-event"),
  "badge-event": token("badge-event"),
  "badge-event-foreground": token("badge-event-foreground"),
  "timeline-event": token("timeline-event"),

  "avatar-unknown": token("avatar-unknown"),
  "badge-unknown": token("badge-unknown"),
  "badge-unknown-foreground": token("badge-unknown-foreground"),
  "timeline-unknown": token("timeline-unknown"),
};
