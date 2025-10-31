type AgentPrismThemeVariant = {
  // === Core tokens ===
  background: string;
  foreground: string;
  muted: string;
  "muted-foreground": string;
  secondary: string;
  "secondary-foreground": string;

  // === Border & inputs (gentle strokes) ===
  border: string;
  input: string;
  ring: string;

  // === Span category badges (semantic by function) ===
  "badge-llm": string;
  "badge-llm-foreground": string;
  "badge-agent": string;
  "badge-agent-foreground": string;
  "badge-tool": string;
  "badge-tool-foreground": string;
  "badge-chain": string;
  "badge-chain-foreground": string;
  "badge-retrieval": string;
  "badge-retrieval-foreground": string;
  "badge-embedding": string;
  "badge-embedding-foreground": string;
  "badge-guardrail": string;
  "badge-guardrail-foreground": string;

  // === Generic/utility badges ===
  "badge-default": string;
  "badge-default-foreground": string;
  "badge-accent": string;
  "badge-accent-foreground": string;
  "badge-highlight": string;
  "badge-highlight-foreground": string;

  // === Status indicators (SpanStatus: success, error, pending, warning) ===
  success: string;
  "success-muted": string;
  "success-muted-foreground": string;
  error: string;
  "error-muted": string;
  "error-muted-foreground": string;
  warning: string;
  "warning-muted": string;
  "warning-muted-foreground": string;
  pending: string;
  "pending-muted": string;
  "pending-muted-foreground": string;

  // === Code syntax highlighting ===
  "code-string": string;
  "code-number": string;
  "code-boolean": string;
  "code-key": string;
  "code-base": string;
};

export type AgentPrismTheme = {
  light: AgentPrismThemeVariant;
  dark: AgentPrismThemeVariant;
};

export type AgentPrismThemePrefixed<T extends string> = {
  [K in keyof AgentPrismTheme as `${T}-${K}`]: AgentPrismTheme[K];
};
