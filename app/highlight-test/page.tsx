
'use client';

import { H } from '@highlight-run/next/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HighlightTestPage() {
  const testHighlight = () => {
    try {
      // Test user identification
      H.identify('test-user-' + Date.now(), {
        email: 'test@agrinetra.com',
        name: 'Test User',
        plan: 'Premium'
      });

      // Test event tracking
      H.track('Button Clicked', {
        button: 'Test Highlight',
        page: '/highlight-test',
        timestamp: new Date().toISOString()
      });

      // Test error tracking
      H.consumeError(new Error('Test error for Highlight.io'), {
        category: 'Test',
        level: 'info'
      });

      console.log('✅ All Highlight.io tests completed successfully');
      alert('Highlight.io tests completed! Check your Highlight dashboard.');
    } catch (error) {
      console.error('❌ Highlight.io test failed:', error);
      alert('Highlight.io test failed - check console for details');
    }
  };

  const testNetworkRequest = async () => {
    try {
      const response = await fetch('/api/test-backend');
      const data = await response.json();
      console.log('✅ Network request completed:', data);
      
      H.track('API Test Completed', {
        status: response.status,
        endpoint: '/api/test-backend'
      });
    } catch (error) {
      console.error('❌ Network request failed:', error);
      H.consumeError(error as Error, {
        category: 'Network',
        level: 'error'
      });
    }
  };

  return (
    <div className="lg:pl-64">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Highlight.io Test Page</h1>
          <p className="text-gray-600 mt-2">Test various Highlight.io features to verify integration</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Recording & Analytics</CardTitle>
              <CardDescription>
                Test user identification, event tracking, and error recording
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testHighlight} className="w-full">
                Test Highlight.io Features
              </Button>
              <Button onClick={testNetworkRequest} variant="outline" className="w-full">
                Test Network Monitoring
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
              <CardDescription>Current configuration details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Project ID:</strong> ney010xd</div>
                <div><strong>Service Name:</strong> agri-netra-frontend</div>
                <div><strong>Network Recording:</strong> Enabled</div>
                <div><strong>Canvas Recording:</strong> Enabled</div>
                <div><strong>Performance Recording:</strong> Enabled</div>
                <div><strong>Debug Mode:</strong> Enabled</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
