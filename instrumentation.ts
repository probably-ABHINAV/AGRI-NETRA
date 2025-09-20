
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Register production monitoring
    await import('./lib/telemetry')
  }
}
