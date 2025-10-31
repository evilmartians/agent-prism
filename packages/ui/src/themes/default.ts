import colors from "tailwindcss/colors";

import type { AgentPrismTheme } from "./types";

export const defaultTheme: AgentPrismTheme = {
  light: {
    background: colors.white,
    foreground: colors.gray[900],
    muted: colors.gray[50],
    "muted-foreground": colors.gray[600],
    secondary: colors.gray[100],
    "secondary-foreground": colors.gray[500],

    // === Border & inputs ===
    border: colors.gray[200],
    input: colors.gray[300],
    ring: colors.purple[500],

    // === Span category badges (semantic by function) ===
    "badge-llm": colors.purple[50],
    "badge-llm-foreground": colors.purple[500],
    "badge-agent": colors.indigo[50],
    "badge-agent-foreground": colors.indigo[500],
    "badge-tool": colors.orange[50],
    "badge-tool-foreground": colors.orange[600],
    "badge-chain": colors.teal[50],
    "badge-chain-foreground": colors.teal[600],
    "badge-retrieval": colors.cyan[50],
    "badge-retrieval-foreground": colors.cyan[600],
    "badge-embedding": colors.emerald[50],
    "badge-embedding-foreground": colors.emerald[700],
    "badge-guardrail": colors.red[50],
    "badge-guardrail-foreground": colors.red[600],

    // === Generic/utility badges ===
    "badge-default": colors.gray[100],
    "badge-default-foreground": colors.gray[600],
    "badge-accent": colors.sky[50],
    "badge-accent-foreground": colors.sky[600],
    "badge-highlight": colors.yellow[50],
    "badge-highlight-foreground": colors.yellow[700],

    // === Status indicators (SpanStatus: success, error, pending, warning) ===
    success: colors.emerald[500],
    "success-muted": colors.emerald[50],
    "success-muted-foreground": colors.emerald[700],
    error: colors.red[500],
    "error-muted": colors.red[50],
    "error-muted-foreground": colors.red[600],
    warning: colors.yellow[500],
    "warning-muted": colors.yellow[50],
    "warning-muted-foreground": colors.yellow[700],
    pending: colors.violet[500],
    "pending-muted": colors.violet[100],
    "pending-muted-foreground": colors.violet[600],

    // === Code syntax highlighting ===
    "code-string": colors.red[600],
    "code-number": "text-red-600",
    "code-boolean": colors.blue[800],
    "code-key": colors.blue[600],
    "code-base": colors.gray[500],
  },
  dark: {
    background: colors.gray[950],
    foreground: colors.gray[100],
    muted: colors.gray[900],
    "muted-foreground": colors.gray[400],
    secondary: colors.gray[800],
    "secondary-foreground": colors.gray[500],

    // === Border & inputs (gentle strokes) ===
    border: colors.gray[700],
    input: colors.gray[600],
    ring: colors.purple[400],

    // === Span category badges (semantic by function) ===
    "badge-llm": colors.purple[950],
    "badge-llm-foreground": colors.purple[300],
    "badge-agent": colors.indigo[950],
    "badge-agent-foreground": colors.indigo[300],
    "badge-tool": colors.orange[950],
    "badge-tool-foreground": colors.orange[300],
    "badge-chain": colors.teal[950],
    "badge-chain-foreground": colors.teal[300],
    "badge-retrieval": colors.cyan[950],
    "badge-retrieval-foreground": colors.cyan[300],
    "badge-embedding": colors.emerald[950],
    "badge-embedding-foreground": colors.emerald[300],
    "badge-guardrail": colors.red[950],
    "badge-guardrail-foreground": colors.red[300],

    // === Generic/utility badges ===
    "badge-default": colors.gray[900],
    "badge-default-foreground": colors.gray[400],
    "badge-accent": colors.sky[950],
    "badge-accent-foreground": colors.sky[300],
    "badge-highlight": colors.yellow[950],
    "badge-highlight-foreground": colors.yellow[300],

    // === Status indicators (SpanStatus: success, error, pending, warning) ===
    success: colors.emerald[500],
    "success-muted": colors.emerald[950],
    "success-muted-foreground": colors.emerald[300],
    error: colors.red[500],
    "error-muted": colors.red[950],
    "error-muted-foreground": colors.red[300],
    warning: colors.yellow[500],
    "warning-muted": colors.yellow[950],
    "warning-muted-foreground": colors.yellow[300],
    pending: colors.violet[500],
    "pending-muted": colors.violet[950],
    "pending-muted-foreground": colors.violet[400],

    // === Code syntax highlighting ===
    "code-string": colors.red[400],
    "code-number": colors.red[400],
    "code-boolean": colors.blue[400],
    "code-key": colors.blue[300],
    "code-base": colors.gray[400],
  },
};
