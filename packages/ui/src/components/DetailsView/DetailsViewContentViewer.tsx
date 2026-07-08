import { type ReactElement } from "react";

import { CopyButton } from "../CopyButton";
import { DetailsViewCodeViewer } from "./DetailsViewCodeViewer";
import { DetailsViewJsonOutput } from "./DetailsViewJsonOutput";

export type DetailsViewContentViewMode = "json" | "plain";

export interface DetailsViewContentViewerProps {
  content: string;
  parsedContent: string | null;
  mode: DetailsViewContentViewMode;
  label: string;
  id: string;
  className?: string;
  /** Shiki language id for the non-JSON (code) view. Wins over `filename`. */
  language?: string;
  /** Filename whose extension detects the language for the non-JSON (code) view. */
  filename?: string;
}

export const DetailsViewContentViewer = ({
  content,
  parsedContent,
  mode,
  label,
  id,
  className = "",
  language,
  filename,
}: DetailsViewContentViewerProps): ReactElement => {
  if (!content) {
    return (
      <p className="text-agentprism-muted-foreground p-3 text-sm italic">
        No data available
      </p>
    );
  }

  return (
    <div
      className={`border-agentprism-border relative rounded-lg border ${className}`}
    >
      <div className="absolute right-1.5 top-1.5 z-10">
        <CopyButton label={label} content={content} />
      </div>
      {mode === "json" && parsedContent ? (
        <DetailsViewJsonOutput content={parsedContent} id={id} />
      ) : (
        <div className="bg-agentprism-background rounded-lg p-4">
          <DetailsViewCodeViewer
            code={content}
            language={language}
            filename={filename}
          />
        </div>
      )}
    </div>
  );
};
