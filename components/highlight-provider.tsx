
'use client';

import { HighlightInit } from '@highlight-run/next/client';
import { useEffect } from 'react';

export default function HighlightProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Additional client-side initialization if needed
    console.log('Highlight.io initialized on client');
  }, []);

  return (
    <>
      <HighlightInit
        projectId={'ney010xd'}
        serviceName="agri-netra-frontend"
        tracingOrigins={['localhost', '0.0.0.0', /.*\.repl\.co$/]}
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [/.*\.css/, /.*\.js/, /.*\.png/, /.*\.jpg/, /.*\.svg/],
        }}
        enableCanvasRecording={true}
        enablePerformanceRecording={true}
        debug={true}
        manualStart={false}
      />
      {children}
    </>
  );
}
