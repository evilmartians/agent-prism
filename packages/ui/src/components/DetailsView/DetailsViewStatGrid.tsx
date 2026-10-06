import type { ReactElement } from "react";

export type StatRowData = {
  label: string;
  sub?: string | undefined;
  value: string;
};

/**
 * A three-column grid (label / value / sub). Using a shared subgrid keeps the
 * bold values right-aligned in one column and the muted `sub` annotations in the
 * next, so rows line up regardless of label or value length and the value never
 * collides with a long label.
 */
export function DetailsViewStatGrid({
  rows,
}: Readonly<{
  rows: readonly Readonly<StatRowData>[];
}>): ReactElement {
  return (
    <div className="divide-agentprism-border grid grid-cols-[1fr_auto_auto] divide-y">
      {rows.map((row) => (
        <div
          className="col-span-3 grid grid-cols-subgrid items-baseline py-1.5"
          key={row.label}
        >
          <span className="text-agentprism-muted-foreground pr-3 text-xs">
            {row.label}
          </span>
          <span className="text-agentprism-foreground text-right text-xs font-medium">
            {row.value}
          </span>
          <span className="text-agentprism-muted-foreground pl-1.5 text-[10px]">
            {row.sub ?? ""}
          </span>
        </div>
      ))}
    </div>
  );
}
