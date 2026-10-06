import * as Collapsible from "@radix-ui/react-collapsible";
import cn from "classnames";
import { ChevronDown } from "lucide-react";
import * as React from "react";

export type CollapsibleSectionProps = {
  /**
   * The title text displayed in the trigger button
   */
  title: string;

  /**
   * The content to display on the right side of the title
   */
  rightContent?: React.ReactNode | undefined;

  /**
   * The content to display when the section is expanded
   */
  children: React.ReactNode;

  /**
   * Whether the section starts in an open state
   * @default false
   */
  defaultOpen?: boolean | undefined;

  /**
   * Optional className for the root container
   */
  className?: string | undefined;

  /**
   * Optional className for the trigger button
   */
  triggerClassName?: string | undefined;

  /**
   * Optional className for the content area
   */
  contentClassName?: string | undefined;

  /**
   * Optional callback fired when the section is expanded or collapsed
   */
  onOpenChange?: ((open: boolean) => void) | undefined;
};

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  rightContent,
  children,
  defaultOpen = false,
  className = "",
  triggerClassName = "",
  contentClassName = "",
  onOpenChange,
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
      open={open}
      onOpenChange={handleOpenChange}
      className={cn("rounded-lg", className)}
    >
      <div
        className={cn(
          "text-agentprism-muted-foreground mb-2.5 flex w-full items-center justify-between gap-2 rounded-lg px-1 text-left text-sm font-medium",
          triggerClassName,
        )}
      >
        <Collapsible.Trigger asChild>
          <div
            tabIndex={0}
            role="button"
            className="text-agentprism-muted-foreground flex min-w-0 flex-1 items-center gap-2"
            onKeyDown={handleKeyDown}
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} content of "${title}" section`}
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
