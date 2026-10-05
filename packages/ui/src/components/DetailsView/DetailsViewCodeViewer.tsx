import type { ReactElement } from "react";

import cn from "classnames";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

export interface DetailsViewCodeViewerProps {
  /** The source text to highlight. */
  code: string;
  /** Explicit shiki language id (e.g. "json", "python"). Wins over `filename`. */
  language?: string;
  /** Filename whose extension is used to detect the language when `language` is absent. */
  filename?: string;
  className?: string;
}

/**
 * Theme-aware shiki highlighting driven entirely by CSS variables: each token
 * defaults to the library's `--agentprism-code-*` oklch tokens, which already
 * switch with the active light/dark theme, so highlighting follows the theme
 * without a second color scheme baked into the bundle.
 */
const CODE_TOKEN_DEFAULTS: Record<string, string> = {
  foreground: "oklch(var(--agentprism-code-base))",
  background: "transparent",
  "token-constant": "oklch(var(--agentprism-code-number))",
  "token-number": "oklch(var(--agentprism-code-number))",
  "token-string": "oklch(var(--agentprism-code-string))",
  "token-string-expression": "oklch(var(--agentprism-code-string))",
  "token-comment": "oklch(var(--agentprism-muted-foreground))",
  "token-keyword": "oklch(var(--agentprism-code-key))",
  "token-function": "oklch(var(--agentprism-code-key))",
  "token-parameter": "oklch(var(--agentprism-code-base))",
  "token-punctuation": "oklch(var(--agentprism-code-base))",
  "token-link": "oklch(var(--agentprism-code-string))",
};

const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  py: "python",
  rb: "ruby",
  rs: "rust",
  go: "go",
  java: "java",
  kt: "kotlin",
  swift: "swift",
  c: "c",
  cpp: "cpp",
  cs: "csharp",
  php: "php",
  html: "html",
  css: "css",
  scss: "scss",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  xml: "xml",
  md: "markdown",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  toml: "toml",
  graphql: "graphql",
};

function detectLanguage(filename?: string): string {
  if (!filename) return "plaintext";

  const parts = filename.split(".");
  if (parts.length < 2) return "plaintext";

  const ext = parts[parts.length - 1].toLowerCase();

  return EXTENSION_TO_LANGUAGE[ext] ?? "plaintext";
}

async function highlightCode(code: string, lang: string): Promise<ReactElement> {
  // Loaded lazily so the ~1 MB web bundle is code-split out of the main chunk
  // and only fetched when a code block is actually rendered.
  const { createCssVariablesTheme } = await import("shiki/core");
  const { codeToHast, bundledLanguages } = await import("shiki/bundle/web");

  const theme = createCssVariablesTheme({
    name: "agentprism",
    variablePrefix: "--shiki-",
    variableDefaults: CODE_TOKEN_DEFAULTS,
  });

  const safeLang = lang in bundledLanguages ? lang : "plaintext";

  const hast = await codeToHast(code, { lang: safeLang, theme });

  return toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: (props) => (
        <pre
          {...props}
          className={cn(
            props.className,
            "overflow-x-auto whitespace-pre rounded-md p-4 text-sm",
          )}
          style={{ ...props.style, margin: 0, background: "transparent" }}
        />
      ),
      code: (props) => (
        <code
          {...props}
          className={cn(props.className, "font-mono")}
          style={{ ...props.style, display: "block", minWidth: "max-content" }}
        />
      ),
    },
  });
}

/**
 * Renders `code` with shiki syntax highlighting. Shows a skeleton while the
 * highlighter loads and falls back to a plain `<pre>` if highlighting fails, so
 * the content is always readable. Copy affordances are left to the container.
 */
export const DetailsViewCodeViewer = ({
  code,
  language,
  filename,
  className,
}: DetailsViewCodeViewerProps): ReactElement => {
  const [highlighted, setHighlighted] = useState<ReactElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const lang = language ?? detectLanguage(filename);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setHasError(false);

    highlightCode(code, lang)
      .then((result) => {
        if (!cancelled) setHighlighted(result);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  if (hasError) {
    return (
      <pre
        className={cn(
          "text-agentprism-foreground overflow-x-auto whitespace-pre-wrap p-4 font-mono text-sm",
          className,
        )}
      >
        {code}
      </pre>
    );
  }

  if (isLoading) {
    return (
      <div className={cn("animate-pulse space-y-2 p-4", className)}>
        <div className="bg-agentprism-muted h-4 w-3/4 rounded" />
        <div className="bg-agentprism-muted h-4 w-1/2 rounded" />
        <div className="bg-agentprism-muted h-4 w-5/6 rounded" />
      </div>
    );
  }

  return <div className={className}>{highlighted}</div>;
};
