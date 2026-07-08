import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { formatBytes, resolveSpanRaw } from "@evilmartians/agent-prism-data";
import { type ReactElement } from "react";

import { CopyButton } from "../CopyButton";
import { DetailsViewJsonOutput } from "./DetailsViewJsonOutput";

interface RawDataTabProps {
  data: TraceSpan;
  /**
   * Verbatim vendor payload for this span, when the consumer has one. Rendered
   * as pretty JSON in place of the normalized `data.raw`; omit it (or pass
   * `null`) to fall back to the normalized string unchanged.
   */
  vendorSlice?: unknown;
}

export const DetailsViewRawDataTab = ({
  data,
  vendorSlice,
}: RawDataTabProps): ReactElement => {
  const content = resolveSpanRaw(vendorSlice ?? null, data.raw);
  const sizeLabel = formatBytes(new Blob([content]).size);

  return (
    <div className="border-agentprism-border rounded-md border bg-transparent">
      <div className="relative">
        <div className="pointer-events-none sticky top-0 z-10 flex items-center justify-end gap-2 p-1.5">
          <span className="text-agentprism-muted-foreground text-xs tabular-nums">
            {sizeLabel}
          </span>
          <div className="pointer-events-auto">
            <CopyButton label="Raw" content={content} />
          </div>
        </div>

        <div className="-mt-12">
          <DetailsViewJsonOutput
            content={content}
            id={data.id || "span-details"}
          />
        </div>
      </div>
    </div>
  );
};
