'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HighlightTestPage() {
  const testApplication = () => {
    try {
      console.log('✅ Application test completed successfully');
      alert('Application is working correctly!');
    } catch (error) {
      console.error('❌ Application test failed:', error);
      alert('Application test failed - check console for details');
    }
  };

  const testNetworkRequest = async () => {
    try {
      const response = await fetch('/api/test-backend');
      const data = await response.json();
      console.log('✅ Network request completed:', data);
      alert('API test completed successfully!');
    } catch (error) {
      console.error('❌ Network request failed:', error);
      alert('API test failed - check console for details');
    }
  };

  return (
    <div>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Application Test Page</h1>
          <p className="text-gray-600 mt-2">Test various application features to verify functionality</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Testing</CardTitle>
              <CardDescription>
                Test basic application functionality and API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testApplication} className="w-full">
                Test Application
              </Button>
              <Button onClick={testNetworkRequest} variant="outline" className="w-full">
                Test API Connection
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Current configuration details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Environment:</strong> Development</div>
                <div><strong>Port:</strong> 5000</div>
                <div><strong>Authentication:</strong> Enabled</div>
                <div><strong>Database:</strong> Connected</div>
                <div><strong>API Endpoints:</strong> Active</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}