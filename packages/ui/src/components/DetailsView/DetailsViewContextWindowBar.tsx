import type { ReactElement } from "react";

type DetailsViewContextWindowBarProps = {
  fill: number;
  limitLabel: string | undefined;
};

export const DetailsViewContextWindowBar = ({
  fill,
  limitLabel,
}: Readonly<DetailsViewContextWindowBarProps>): ReactElement => (
  <>
    <div
      aria-label="Context window fill"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Number(fill.toFixed(1))}
      aria-valuetext={`${fill.toFixed(1)}%`}
      className="bg-agentprism-secondary relative h-4 overflow-hidden rounded-md"
      role="progressbar"
    >
      <div
        className="bg-agentprism-context-source-conversation absolute left-0 top-0 h-full transition-all"
        style={{ width: `${fill}%` }}
      />
      <div
        className="bg-agentprism-warning absolute top-0 h-full w-px"
        style={{ left: "78%" }}
        title="Compaction threshold"
      />
    </div>
    {limitLabel === undefined ? null : (
      <div className="text-agentprism-muted-foreground mt-1 flex justify-between text-[10px]">
        <span>0</span>
        <span>{limitLabel}</span>
      </div>
    )}
  </>
);
