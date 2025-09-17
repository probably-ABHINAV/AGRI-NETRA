
'use client'

import Navigation from '@/components/navigation'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  )
}
