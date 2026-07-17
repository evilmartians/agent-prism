import type { RunErrorEntry } from "@evilmartians/agent-prism-data";
import type { ReactElement } from "react";

import { formatSpanErrorForAgent } from "@evilmartians/agent-prism-data";
import { useMemo } from "react";

import { CopyButton } from "../CopyButton";
import { ErrorStatusCircle } from "../ErrorStatusCircle";

interface DetailsViewErrorRunRowProps {
  entry: RunErrorEntry;
}

/**
 * A single failed-span card: error dot + node title + message (+ stack when
 * present), with a button to copy the error formatted for an AI agent.
 */
export const DetailsViewErrorRunRow = ({
  entry,
}: DetailsViewErrorRunRowProps): ReactElement => {
  const { details } = entry;
  const title = details.nodeName;
  // Built lazily-ish: only read on copy click, so avoid rebuilding the Markdown
  // on unrelated re-renders.
  const agentContent = useMemo(
    () => formatSpanErrorForAgent(details),
    [details],
  );

  return (
    <article className="border-agentprism-border rounded-md border p-4">
      <div className="flex items-start gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center">
          <ErrorStatusCircle />
        </span>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-agentprism-error line-clamp-3 min-w-0 flex-1 text-sm font-medium leading-5">
              {/* Convey "error" to assistive tech / colorblind users; the red
                  title and decorative dot are the only other error signals. */}
              <span className="sr-only">Error: </span>
              {title}
            </h4>

            <CopyButton label="error for agent" content={agentContent} />
          </div>

          <p className="text-agentprism-foreground whitespace-pre-wrap break-words text-sm">
            {details.message}
          </p>

          {details.stack && (
            <pre className="text-agentprism-muted-foreground overflow-x-auto whitespace-pre-wrap break-words text-xs">
              {details.stack}
            </pre>
          )}
        </div>
      </div>
    </article>
  );
};

interface DetailsViewErrorEntryListProps {
  entries: RunErrorEntry[];
}

/**
 * Vertical stack of {@link DetailsViewErrorRunRow}; renders nothing when empty.
 */
export const DetailsViewErrorEntryList = ({
  entries,
}: DetailsViewErrorEntryListProps): ReactElement | null => {
  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <DetailsViewErrorRunRow key={entry.span.id} entry={entry} />
      ))}
    </div>
  );
};
