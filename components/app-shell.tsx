
'use client'

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navigation from "./navigation";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  
  // Check if we're on landing page or auth pages where navigation is hidden
  const shouldShowNavigation = pathname !== "/" && !pathname.startsWith("/auth/")
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Apply left padding only when navigation sidebar is shown */}
      <main className={shouldShowNavigation ? "lg:pl-64" : ""}>
        {children}
      </main>
    </div>
  )
}

export { AppShell }
