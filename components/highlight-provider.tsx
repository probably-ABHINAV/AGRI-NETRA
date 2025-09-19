'use client'

import { HighlightInit } from '@highlight-run/next/client'
import { ErrorBoundary } from './error-boundary'

export default function HighlightProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <HighlightInit
        projectId={process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID || 'ney010xd'}
        serviceName="agri-netra-frontend"
        tracingOrigins={['localhost', '0.0.0.0', /.+/]}
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [
            // Add URLs you don't want to record here
          ],
        }}
        enableCanvasRecording={true}
        enablePerformanceRecording={true}
        debug={process.env.NODE_ENV === 'development'}
        manualStart={false}
      />
      {children}
    </ErrorBoundary>
  )
}