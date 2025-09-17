
import { NextRequest, NextResponse } from 'next/server'
import { trace } from '@opentelemetry/api'
import { H } from '@highlight-run/next/server'

const tracer = trace.getTracer('smartfarm-backend', '1.0.0')

// Create a simple wrapper function since withHighlight might not be available
export const withAppRouterHighlight = (handler: any) => {
  return async (request: NextRequest) => {
    const { span } = H.startWithHeaders('api-request', {})
    
    try {
      const response = await handler(request)
      span.end()
      return response
    } catch (error) {
      span.recordException(error as Error)
      span.end()
      throw error
    }
  }
}

export { tracer }
