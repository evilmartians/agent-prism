import cn from "classnames";
import { User } from "lucide-react";
import { useState, type ComponentPropsWithRef, type ReactElement } from "react";

import { ROUNDED_CLASSES, type ColorVariant } from "./shared.ts";

const sizeClasses = {
  xs: "size-4 text-xs",
  sm: "size-5 text-sm",
  md: "size-8 text-base",
  lg: "size-10 text-lg",
  xl: "size-12 text-xl",
};

const iconSizeClasses = {
  xs: "size-3",
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
  xl: "size-10",
};

const textSizeClasses = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const bgColorClasses: Record<ColorVariant, string> = {
  gray: "bg-gray-600",
  red: "bg-red-600",
  orange: "bg-orange-600",
  yellow: "bg-yellow-600",
  teal: "bg-teal-600",
  indigo: "bg-indigo-600",
  purple: "bg-purple-600",
  sky: "bg-sky-600",
  cyan: "bg-cyan-600",
  emerald: "bg-emerald-600",
};

export type AvatarProps = ComponentPropsWithRef<"div"> & {
  /**
   * The image source for the avatar
   */
  src?: string;
  /**
   * The alt text for the avatar
   */
  alt?: string;
  /**
   * The size of the avatar
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * The border radius of the avatar
   * @default "full"
   */
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  /**
   * Background color theme for the letter avatar
   * Uses the unified color theme system
   * @default "gray"
   */
  bgColor?: ColorVariant;
  /**
   * Text color for the letter avatar
   * @default "white"
   */
  textColor?: "white" | "black";
  /**
   * Custom letter to display (will use first letter of alt if not provided)
   */
  letter?: string;
  /**
   * Optional className for additional styling
   */
  className?: string;
};

export const Avatar = ({
  src,
  alt = "Avatar",
  size = "md",
  rounded = "full",
  bgColor = "gray",
  textColor = "white",
  letter,
  className = "",
  ...rest
}: AvatarProps): ReactElement => {
  const [error, setError] = useState(false);

  const displayLetter = letter ? letter.charAt(0) : alt.charAt(0).toUpperCase();

  const actualTextColor = textColor === "white" ? "text-white" : "text-black";

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden",
        "bg-gray-200 dark:bg-gray-700",
        error && "border border-gray-300 dark:border-gray-600",
        sizeClasses[size],
        textSizeClasses[size],
        ROUNDED_CLASSES[rounded],
        className,
      )}
      {...rest}
    >
      {error ? (
        <User
          className={cn(
            iconSizeClasses[size],
            "text-gray-600 dark:text-gray-400",
          )}
        />
      ) : (
        <>
          {src ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              onError={() => setError(true)}
            />
          ) : (
            <div
              className={cn(
                "flex h-full w-full items-center justify-center",
                bgColorClasses[bgColor],
                actualTextColor,
                "font-medium",
              )}
            >
              {displayLetter}
            </div>
          )}
        </>
      )}
    </div>
  );
};
