'use client'

import { ReactNode } from "react";
import Navigation from "./navigation";
import { useHighlightIdentification } from "@/hooks/use-highlight";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  useHighlightIdentification();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* This class pushes the main content to the right of the sidebar on large screens */}
      <main className="lg:pl-64">
        {children}
      </main>
    </div>
  )
}

export { AppShell }