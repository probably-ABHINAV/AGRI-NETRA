
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('Instrumentation loaded (no active telemetry)')
  }
}
