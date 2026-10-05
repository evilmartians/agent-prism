import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { formatBytes, resolveSpanRaw } from "@evilmartians/agent-prism-data";
import { type ReactElement } from "react";

import { CopyButton } from "../CopyButton";
import { DetailsViewJsonOutput } from "./DetailsViewJsonOutput";

interface RawDataTabProps {
  data: TraceSpan;
  /**
   * Verbatim vendor payload for this span, when the consumer has one. Rendered
   * as pretty JSON in place of the span's `raw` records; omit it (or pass
   * `null`) to show those records unchanged.
   */
  vendorSlice?: unknown;
}

/**
 * One block per source record: a span assembled from several records (say, a
 * start and an end event) shows each of them, with its own size and copy
 * button.
 */
export const DetailsViewRawDataTab = ({
  data,
  vendorSlice,
}: RawDataTabProps): ReactElement => {
  const records = resolveSpanRaw(vendorSlice ?? null, data.raw);

  if (records.length === 0) {
    return (
      <div className="border-agentprism-border rounded-md border p-4">
        <p className="text-agentprism-muted-foreground text-sm">
          No raw data available for this span.
        </p>
      </div>
    );
  }

  const baseId = data.id || "span-details";

  return (
    <div className="space-y-4">
      {records.map((content, index) => {
        // Numbered when there are several, so screen readers can tell them apart.
        const label =
          records.length > 1 ? `Raw ${index + 1} of ${records.length}` : "Raw";

        return (
          <div
            key={index}
            role="group"
            aria-label={label}
            className="border-agentprism-border rounded-md border bg-transparent"
          >
            <div className="relative">
              <div className="pointer-events-none sticky top-0 z-10 flex items-center justify-end gap-2 p-1.5">
                <span className="text-agentprism-muted-foreground text-xs tabular-nums">
                  {formatBytes(new Blob([content]).size)}
                </span>
                <div className="pointer-events-auto">
                  <CopyButton label={label} content={content} />
                </div>
              </div>

              <div className="-mt-12">
                <DetailsViewJsonOutput
                  content={content}
                  id={`${baseId}-${index}`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
