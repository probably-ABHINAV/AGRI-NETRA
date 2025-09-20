
// Production telemetry and monitoring
export class TelemetryService {
  private static instance: TelemetryService;
  
  private constructor() {}
  
  static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }
  
  track(event: string, properties?: Record<string, any>) {
    if (process.env.NODE_ENV === 'production') {
      console.log(`[TELEMETRY] ${event}`, properties);
      // Add your production analytics service here
    }
  }
  
  error(error: Error, context?: Record<string, any>) {
    console.error('[ERROR]', error.message, context);
    
    if (process.env.NODE_ENV === 'production') {
      // Add your error reporting service here
      // Example: Sentry, LogRocket, etc.
    }
  }
  
  performance(metric: string, value: number, unit: string = 'ms') {
    if (process.env.NODE_ENV === 'production') {
      console.log(`[PERFORMANCE] ${metric}: ${value}${unit}`);
      // Add your performance monitoring here
    }
  }
}

export const telemetry = TelemetryService.getInstance();

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    telemetry.error(event.error || new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    telemetry.error(new Error(event.reason), {
      type: 'unhandledrejection',
    });
  });
}
