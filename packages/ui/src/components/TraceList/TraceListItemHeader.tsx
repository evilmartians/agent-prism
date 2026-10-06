import type { TraceRecord } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import type { AvatarProps } from "../Avatar";
import type { ReadonlyProps } from "../ReadonlyProps";

import { Avatar } from "../Avatar";
import { Badge } from "../Badge";

type TraceListItemHeaderProps = {
  avatar?: Omit<AvatarProps, "ref"> | undefined;
  trace: TraceRecord;
};

export const TraceListItemHeader = ({
  avatar,
  trace,
}: ReadonlyProps<TraceListItemHeaderProps>): ReactElement => {
  return (
    <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
        {avatar ? <Avatar size="4" {...avatar} /> : null}

        <h3 className="text-agentprism-muted-foreground max-w-full truncate text-sm">
          {trace.name}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          label={
            trace.spansCount === 1 ? "1 span" : `${trace.spansCount} spans`
          }
          size="4"
        />
      </div>
    </div>
  );
};
