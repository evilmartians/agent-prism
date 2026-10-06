import type { KeyboardEvent, MouseEvent, ReactElement } from "react";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

type SpanCardToggleProps = {
  isExpanded: boolean;
  onToggleClick: (e: KeyboardEvent | MouseEvent) => void;
  title: string;
};

export const SpanCardToggle = ({
  isExpanded,
  onToggleClick,
  title,
}: SpanCardToggleProps): ReactElement => (
  <Collapsible.Trigger asChild>
    <button
      aria-expanded={isExpanded}
      aria-label={`${isExpanded ? "Collapse" : "Expand"} ${title} children`}
      className="flex h-4 w-5 shrink-0 items-center justify-center"
      onClick={onToggleClick}
      onKeyDown={onToggleClick}
      type="button"
    >
      {isExpanded ? (
        <ChevronDown
          aria-hidden="true"
          className="text-agentprism-muted-foreground size-3"
        />
      ) : (
        <ChevronRight
          aria-hidden="true"
          className="text-agentprism-muted-foreground size-3"
        />
      )}
    </button>
  </Collapsible.Trigger>
);
