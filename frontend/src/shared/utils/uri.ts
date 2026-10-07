export function buildBip21(address: string, amount: string): string {
  return `bitcoin:${address}?amount=${amount}`
}
