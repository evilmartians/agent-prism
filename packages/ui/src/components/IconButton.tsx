import type { ComponentPropsWithRef, ReactElement } from "react";

import cn from "classnames";

import type { ComponentSize } from "./ComponentSize";

export type IconButtonProps = ComponentPropsWithRef<"button"> & {
  /**
   * Accessible label for screen readers
   * Required for accessibility compliance
   */
  "aria-label": string;

  /**
   * The size of the icon button
   */
  size?: IconButtonSize | undefined;

  /**
   * The visual variant of the icon button
   */
  variant?: IconButtonVariant | undefined;
};
type IconButtonSize = Extract<
  ComponentSize,
  "6" | "7" | "8" | "9" | "10" | "11" | "12" | "16"
>;

type IconButtonVariant = "default" | "ghost";

const sizeClasses: Record<IconButtonSize, string> = {
  "6": "h-6 min-h-6",
  "7": "h-7 min-h-7",
  "8": "h-8 min-h-8",
  "9": "h-9 min-h-9",
  "10": "h-10 min-h-10",
  "11": "h-11 min-h-11",
  "12": "h-12 min-h-12",
  "16": "h-16 min-h-16",
};

const variantClasses: Record<IconButtonVariant, string> = {
  default: "border border-agentprism-border bg-transparent",
  ghost: "bg-transparent",
};

export const IconButton = ({
  "aria-label": ariaLabel,
  children,
  className,
  size = "6",
  type = "button",
  variant = "default",
  ...rest
}: IconButtonProps): ReactElement => {
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        className,
        sizeClasses[size],
        "inline-flex aspect-square shrink-0 items-center justify-center",
        "rounded-md",
        variantClasses[variant],
        "text-agentprism-secondary-foreground",
        "hover:bg-agentprism-secondary",
      )}
      type={
        type === "submit" ? "submit" : type === "reset" ? "reset" : "button"
      }
      {...rest}
    >
      {children}
    </button>
  );
};
