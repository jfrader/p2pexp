import { satsToBtc } from './amount'
import type { InvoiceRecord } from '../../invoices/schema'

export function buildBip21(
  address: string,
  amountSats: number,
  description?: string | null,
): string {
  const params = new URLSearchParams({ amount: satsToBtc(amountSats) })
  if (description) params.set('message', description)
  return `bitcoin:${address}?${params.toString().replace(/\+/g, '%20')}`
}

export function inspectUrl(record: InvoiceRecord): string {
  return `https://mempool.space/address/${record.address}`
}
