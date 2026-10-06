import type { ReactElement } from "react";

export const TraceViewerPlaceholder = ({
  title,
}: {
  title: string;
}): ReactElement => (
  <p className="text-agentprism-muted-foreground bg-agentprism-background flex h-full items-center justify-center rounded-lg p-4 text-center">
    {title}
  </p>
);
