import type { TraceRecord } from "../types";

import { formatDuration } from "../services/calculate-duration";
import { Avatar, type AvatarProps } from "./Avatar";
import { Badge } from "./Badge";

interface TraceListItemHeaderProps {
  trace: TraceRecord;
  avatar?: AvatarProps;
}

export const TraceListItemHeader = ({
  trace,
  avatar,
}: TraceListItemHeaderProps) => {
  return (
    <header className="flex min-w-0 flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
        {avatar && <Avatar {...avatar} />}

        <h3 className="font-regular max-w-full truncate text-sm text-gray-950 dark:text-gray-200">
          {trace.name}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <Badge size="sm" theme="gray" variant="outline">
          {trace.spansCount === 1 ? "1 span" : `${trace.spansCount} spans`}
        </Badge>

        <Badge size="sm" theme="gray" variant="outline">
          {formatDuration(trace.durationMs)}
        </Badge>
      </div>
    </header>
  );
};
