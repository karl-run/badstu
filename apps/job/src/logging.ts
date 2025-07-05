export function logWithTimestamp(message: string) {
  console.log(`${new Date().toISOString()}: ${message}`)
}

function errorWithTimestamp(message: unknown) {
  console.error(`${new Date().toISOString()}`, message)
}
