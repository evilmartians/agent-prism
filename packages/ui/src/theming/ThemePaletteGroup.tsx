import type { ReactElement, ReactNode } from "react";

export function ThemePaletteGroup({
  children,
  title,
}: Readonly<{
  children: ReactNode;
  title: string;
}>): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="mb-2 text-center text-lg font-bold">{title}</h2>
      {children}
    </div>
  );
}
