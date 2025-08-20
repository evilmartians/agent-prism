import {
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import cn from "classnames";
import { X } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
  startIcon?: ReactNode;
  onClear?: () => void;
  clearable?: boolean;
  ref?: RefObject<HTMLInputElement | null>;
  inputClassName?: string;
}

const iconBaseClassName =
  "absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-700 dark:text-gray-500";

export const Input = ({
  className,
  onChange,
  onValueChange,
  startIcon,
  onClear,
  clearable = true,
  ref,
  inputClassName,
  ...props
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  const handleClear = () => {
    onClear?.();

    if (ref) {
      ref.current?.focus();
      return;
    }

    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center",
        className,
      )}
    >
      <input
        {...props}
        ref={ref || inputRef}
        onChange={handleChange}
        className={cn(
          inputClassName,
          "flex h-7 items-center truncate",
          "w-full px-2",
          !!startIcon && "pl-8",
          !!onClear && "pr-8",
          "rounded border border-gray-200 bg-transparent dark:border-gray-600",
          "text-gray-700 placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-600",
          "hover:border-gray-300 dark:hover:border-gray-700",
          "outline-none outline-offset-0 focus-visible:outline-1 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-300",
        )}
      />
      {startIcon && (
        <div className={cn(iconBaseClassName, "left-2")} aria-hidden>
          {startIcon}
        </div>
      )}
      {onClear && clearable && (
        <button
          className={cn(iconBaseClassName, "right-2")}
          aria-label="Clear input value"
          onClick={handleClear}
          type="button"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
};
