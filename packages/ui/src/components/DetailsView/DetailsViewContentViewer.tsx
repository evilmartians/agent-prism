import { type ReactElement } from "react";

import { CopyButton } from "../CopyButton";
import { DetailsViewJsonOutput } from "./DetailsViewJsonOutput";

export type DetailsViewContentViewMode = "json" | "plain";

export interface DetailsViewContentViewerProps {
  content: string;
  parsedContent: string | null;
  mode: DetailsViewContentViewMode;
  label: string;
  id: string;
  className?: string;
}

export const DetailsViewContentViewer = ({
  content,
  parsedContent,
  mode,
  label,
  id,
  className = "",
}: DetailsViewContentViewerProps): ReactElement => {
  if (!content) {
    return (
      <p className="p-3 text-sm italic text-gray-500 dark:text-gray-400">
        No data available
      </p>
    );
  }

  return (
    <div
      className={`relative rounded-lg border border-gray-200 dark:border-gray-800 ${className}`}
    >
      <div className="absolute right-1.5 top-1.5 z-10">
        <CopyButton label={label} content={content} />
      </div>
      {mode === "json" && parsedContent ? (
        <DetailsViewJsonOutput content={parsedContent} id={id} />
      ) : (
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <pre className="overflow-x-auto whitespace-pre-wrap text-left font-mono text-sm text-gray-900 dark:text-gray-100">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
};
