'use client';

import { useEffect } from 'react';
import { H } from '@highlight-run/next/client';

export function useHighlightIdentification() {
  useEffect(() => {
    try {
      // Identify user with Highlight.io
      H.identify('demo-user-' + Math.random().toString(36).substr(2, 9), {
        email: 'demo@agrinetra.com',
        name: 'Demo User',
        environment: 'development'
      });
      
      console.log('✅ User identified with Highlight.io successfully');
      
      // Test session recording
      H.track('Page Visited', {
        path: window.location.pathname,
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ Event tracked with Highlight.io');
      
    } catch (error) {
      console.error('❌ Failed to initialize Highlight.io:', error);
    }
  }, []);
}