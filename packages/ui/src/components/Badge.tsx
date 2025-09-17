import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";

import cn from "classnames";

import { COLOR_THEME_CLASSES, type ColorVariant } from "./shared.ts";

const sizeClasses = {
  xs: "px-1 gap-1 h-4",
  sm: "px-1.5 gap-1 h-5",
  md: "px-2 gap-1.5 h-6",
  lg: "px-2.5 gap-2 h-7",
};

const textSizes = {
  xs: "text-xs font-normal leading-3",
  sm: "text-xs font-medium",
  md: "text-sm font-medium",
};

export type BadgeProps = ComponentPropsWithRef<"span"> & {
  /**
   * The content of the badge
   */
  label: ReactNode;

  /**
   * The color theme of the badge
   * Uses the unified color theme system
   * @default "gray"
   */
  theme: ColorVariant;

  /**
   * The visual variant of the badge
   * @default "solid"
   */
  variant?: "solid" | "outline";

  /**
   * The size of the badge
   * @default "md"
   */
  size?: "sm" | "md" | "xs";

  /**
   * Optional icon to display at the start of the badge
   */
  iconStart?: ReactElement;

  /**
   * Optional icon to display at the end of the badge
   */
  iconEnd?: ReactElement;

  /**
   * Optional className for additional styling
   */
  className?: string;
};

export const Badge = ({
  label,
  theme = "gray",
  variant = "solid",
  size = "md",
  iconStart,
  iconEnd,
  className = "",
  ...rest
}: BadgeProps): ReactElement => {
  const { bg, darkBg, text, darkText } = COLOR_THEME_CLASSES[theme];

  const variantClasses =
    variant === "outline"
      ? `border border-gray-200 dark:border-gray-800 ${text} ${darkText} bg-transparent dark:bg-transparent`
      : `${bg} ${text} ${darkBg} ${darkText}`;

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center overflow-hidden rounded font-medium",
        variantClasses,
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {iconStart && <span className="shrink-0">{iconStart}</span>}

      <span
        className={cn(
          textSizes[size],
          "min-w-0 max-w-full flex-shrink-0 truncate tracking-normal",
        )}
      >
        {label}
      </span>

      {iconEnd && <span className="shrink-0">{iconEnd}</span>}
    </span>
  );
};
