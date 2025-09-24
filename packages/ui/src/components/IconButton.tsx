import type { ComponentPropsWithRef } from "react";

import cn from "classnames";

type IconButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
type IconButtonVariant = "default" | "ghost";

export type IconButtonProps = ComponentPropsWithRef<"button"> & {
  /**
   * The size of the icon button
   */
  size?: IconButtonSize;

  /**
   * The visual variant of the icon button
   */
  variant?: IconButtonVariant;

  /**
   * Accessible label for screen readers
   * Required for accessibility compliance
   */
  "aria-label": string;
};

const sizeClasses: Record<IconButtonSize, string> = {
  xs: "h-6 min-h-6",
  sm: "h-8 min-h-8",
  md: "h-9 min-h-9",
  lg: "h-10 min-h-10",
  xl: "h-11 min-h-11",
  "2xl": "h-12 min-h-12",
  "3xl": "h-16 min-h-16",
};

const variantClasses: Record<IconButtonVariant, string> = {
  default: "rounded border border-gray-200 bg-transparent dark:border-gray-800",
  ghost: "rounded bg-transparent",
};

// TODO: Remake to call Icon component directly instead of passing children
export const IconButton = ({
  children,
  className,
  size = "xs",
  variant = "default",
  type = "button",
  "aria-label": ariaLabel,
  ...rest
}: IconButtonProps) => {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={cn(
        className,
        sizeClasses[size],
        "inline-flex aspect-square shrink-0 items-center justify-center",
        variantClasses[variant],
        "text-gray-500 dark:text-gray-400",
        "hover:bg-gray-200 dark:hover:bg-gray-800",
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
