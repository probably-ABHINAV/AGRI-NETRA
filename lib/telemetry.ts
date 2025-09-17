
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import type { Attributes } from '@opentelemetry/api'

const attributes: Attributes = {
  // Provide the highlight project ID as a resource attribute
  'highlight.project_id': 'ney010xd',
  'service.name': 'smartfarm-backend',
  'service.version': '1.0.0',
  'deployment.environment': process.env.NODE_ENV || 'development'
}

const sdk = new NodeSDK({
  resource: new Resource(attributes),
  traceExporter: new OTLPTraceExporter({
    // URL for trace exports to Highlight.io
    url: 'https://otel.highlight.io:4318/v1/traces',
    headers: {
      'x-highlight-project': 'ney010xd'
    }
  }),
  instrumentations: [getNodeAutoInstrumentations()]
})

// Initialize the SDK
if (process.env.NODE_ENV !== 'test') {
  sdk.start()
  console.log('OpenTelemetry tracing initialized successfully')
}

export { sdk }
