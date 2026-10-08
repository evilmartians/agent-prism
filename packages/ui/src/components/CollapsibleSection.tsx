import * as Collapsible from "@radix-ui/react-collapsible";
import cn from "classnames";
import { ChevronDown } from "lucide-react";
import * as React from "react";

import type { ReadonlyProps } from "./ReadonlyProps";

export type CollapsibleSectionProps = {
  /**
   * The content to display when the section is expanded
   */
  children: React.ReactNode;

  /**
   * Optional className for the root container
   */
  className?: string | undefined;

  /**
   * Optional className for the content area
   */
  contentClassName?: string | undefined;

  /**
   * Whether the section starts in an open state
   * @default false
   */
  defaultOpen?: boolean | undefined;

  /**
   * Optional callback fired when the section is expanded or collapsed
   */
  onOpenChange?: ((open: boolean) => void) | undefined;

  /**
   * The content to display on the right side of the title
   */
  rightContent?: React.ReactNode | undefined;

  /**
   * The title text displayed in the trigger button
   */
  title: string;

  /**
   * Optional className for the trigger button
   */
  triggerClassName?: string | undefined;
};

export const CollapsibleSection: React.FC<
  ReadonlyProps<CollapsibleSectionProps>
> = ({
  children,
  className = "",
  contentClassName = "",
  defaultOpen = false,
  onOpenChange,
  rightContent,
  title,
  triggerClassName = "",
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean): void => {
      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpenChange(!open);
      }
    },
    [handleOpenChange, open],
  );

  return (
    <Collapsible.Root
      className={cn("rounded-lg", className)}
      onOpenChange={handleOpenChange}
      open={open}
    >
      <div
        className={cn(
          "text-agentprism-muted-foreground mb-2.5 flex w-full items-center justify-between gap-2 rounded-lg px-1 text-left text-sm font-medium",
          triggerClassName,
        )}
      >
        <Collapsible.Trigger asChild>
          <div
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} content of "${title}" section`}
            className="text-agentprism-muted-foreground flex min-w-0 flex-1 items-center gap-2"
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
          >
            <ChevronDown
              className={cn("size-3 shrink-0 -rotate-90", open && "rotate-0")}
            />
            <span
              className="min-w-0 truncate text-sm font-medium"
              title={title}
            >
              {title}
            </span>
          </div>
        </Collapsible.Trigger>

        <div className="shrink-0">{rightContent}</div>
      </div>

      <Collapsible.Content
        className={cn("text-agentprism-muted-foreground", contentClassName)}
      >
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
