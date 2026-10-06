import type { Metadata } from "next";

import "./globals.css";
import "@evilmartians/agent-prism-ui/theme.css";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  description: "A web application for viewing and managing AI agent logs.",
  title: "AI Agent Logs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
