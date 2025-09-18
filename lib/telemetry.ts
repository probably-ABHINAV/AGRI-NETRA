
import { NodeSDK } from '@opentelemetry/sdk-node'
import { Resource } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor } from '@opentelemetry/sdk-node'

// Only initialize telemetry in production or when explicitly enabled
const shouldInitializeTelemetry = process.env.NODE_ENV === 'production' || 
  process.env.ENABLE_TELEMETRY === 'true'

if (shouldInitializeTelemetry) {
  try {
    const sdk = new NodeSDK({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: 'agri-netra-backend',
        [ATTR_SERVICE_VERSION]: '1.0.0',
      }),
      spanProcessors: [
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'https://otel.highlight.io:4318/v1/traces',
            headers: {
              'x-highlight-project': process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID || 'ney010xd',
            },
          })
        ),
      ],
      instrumentations: [
        new HttpInstrumentation({
          // Avoid instrumenting internal Next.js requests
          ignoredUrls: [
            /\/_next\//,
            /\/api\/health/,
            /\/favicon\.ico/,
            /\/robots\.txt/,
          ],
        }),
        new ExpressInstrumentation(),
      ],
    })

    sdk.start()
    console.log('OpenTelemetry SDK initialized successfully')
  } catch (error) {
    console.warn('Failed to initialize OpenTelemetry SDK:', error)
  }
} else {
  console.log('Telemetry disabled in development environment')
}

export {}
