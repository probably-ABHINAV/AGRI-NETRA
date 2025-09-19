import { NextRequest, NextResponse } from 'next/server'

// Simple wrapper function without Highlight.io
export const withAppRouterHighlight = (handler: any) => {
  return async (request: NextRequest) => {
    try {
      const response = await handler(request)
      return response
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }
}

export function withHighlight<T extends any[], R>(
  fn: (...args: T) => R | Promise<R>
): (...args: T) => R | Promise<R> {
  return fn
}
```import { NextRequest, NextResponse } from 'next/server'

// Simple wrapper function without Highlight.io
export const withAppRouterHighlight = (handler: any) => {
  return async (request: NextRequest) => {
    try {
      const response = await handler(request)
      return response
    } catch (error) {
      console.error('API request error:', error)
      throw error
    }
  }
}

export function withHighlight<T extends any[], R>(
  fn: (...args: T) => R | Promise<R>
): (...args: T) => R | Promise<R> {
  return fn
}