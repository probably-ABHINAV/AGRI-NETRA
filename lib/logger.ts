
type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
  userId?: string
  requestId?: string
}

class Logger {
  private static instance: Logger
  private isDevelopment = process.env.NODE_ENV === 'development'

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, error, userId, requestId } = entry
    
    if (this.isDevelopment) {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${
        context ? ` | Context: ${JSON.stringify(context)}` : ''
      }${error ? ` | Error: ${error.message}` : ''}`
    }

    return JSON.stringify({
      level,
      message,
      timestamp,
      ...(context && { context }),
      ...(error && { error: { message: error.message, stack: error.stack } }),
      ...(userId && { userId }),
      ...(requestId && { requestId }),
    })
  }

  private log(level: LogLevel, message: string, meta: Omit<LogEntry, 'level' | 'message' | 'timestamp'> = {}) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    }

    const formattedLog = this.formatLog(entry)

    switch (level) {
      case 'error':
        console.error(formattedLog)
        break
      case 'warn':
        console.warn(formattedLog)
        break
      case 'info':
        console.info(formattedLog)
        break
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedLog)
        }
        break
    }

    // In production, you would send to your logging service here
    if (!this.isDevelopment && (level === 'error' || level === 'warn')) {
      this.sendToLoggingService(entry)
    }
  }

  private async sendToLoggingService(entry: LogEntry) {
    try {
      // Example: Send to external logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // })
      
      // For now, just ensure it's logged to console in production
      console.log('PRODUCTION_LOG:', JSON.stringify(entry))
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>, userId?: string, requestId?: string) {
    this.log('error', message, { error, context, userId, requestId })
  }

  warn(message: string, context?: Record<string, any>, userId?: string, requestId?: string) {
    this.log('warn', message, { context, userId, requestId })
  }

  info(message: string, context?: Record<string, any>, userId?: string, requestId?: string) {
    this.log('info', message, { context, userId, requestId })
  }

  debug(message: string, context?: Record<string, any>, userId?: string, requestId?: string) {
    this.log('debug', message, { context, userId, requestId })
  }

  // Convenience methods for common scenarios
  authError(message: string, email?: string, error?: Error) {
    this.error(`Authentication: ${message}`, error, { email })
  }

  apiError(endpoint: string, error: Error, userId?: string, requestId?: string) {
    this.error(`API Error: ${endpoint}`, error, { endpoint }, userId, requestId)
  }

  databaseError(operation: string, error: Error, userId?: string) {
    this.error(`Database: ${operation}`, error, { operation }, userId)
  }

  performanceLog(operation: string, duration: number, userId?: string) {
    this.info(`Performance: ${operation}`, { duration, unit: 'ms' }, userId)
  }
}

export const logger = Logger.getInstance()

// Utility function for timing operations
export function withTiming<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now()
  return fn().finally(() => {
    const duration = Date.now() - start
    logger.performanceLog(operation, duration)
  })
}

// Express/Next.js request logging middleware
export function createRequestLogger() {
  return (req: any, res: any, next: any) => {
    const start = Date.now()
    const requestId = Math.random().toString(36).substring(2, 15)
    
    req.requestId = requestId
    
    logger.info(`${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    }, undefined, requestId)

    const originalSend = res.send
    res.send = function(body: any) {
      const duration = Date.now() - start
      logger.info(`${req.method} ${req.url} completed`, {
        statusCode: res.statusCode,
        duration,
        contentLength: body?.length,
      }, undefined, requestId)
      
      return originalSend.call(this, body)
    }

    next()
  }
}
