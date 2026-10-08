import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { type ReactElement } from "react";

import type { ReadonlyProps } from "../ReadonlyProps";

import { CopyButton } from "../CopyButton";
import { DetailsViewJsonOutput } from "./DetailsViewJsonOutput";

type RawDataTabProps = {
  data: TraceSpan;
};

/**
 * One block per source record: a span assembled from several records (say, a
 * start and an end event) shows each of them, with its own copy button. Blocks
 * are numbered when there are several, so screen readers can tell them apart.
 */
export const DetailsViewRawDataTab = ({
  data,
}: ReadonlyProps<RawDataTabProps>): ReactElement => {
  if (data.raw.length === 0) {
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
      {data.raw.map((content, index) => {
        const label =
          data.raw.length > 1
            ? `Raw ${index + 1} of ${data.raw.length}`
            : "Raw";

        return (
          <div
            aria-label={label}
            className="border-agentprism-border rounded-md border bg-transparent"
            key={index}
            role="group"
          >
            <div className="relative">
              <div className="pointer-events-none sticky top-0 z-10 flex justify-end p-1.5">
                <div className="pointer-events-auto">
                  <CopyButton content={content} label={label} />
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
