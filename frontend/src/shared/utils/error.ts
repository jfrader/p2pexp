export function errorMessage(cause: unknown): string {
  if (cause instanceof Error && cause.message !== '') return cause.message
  return String(cause)
}
