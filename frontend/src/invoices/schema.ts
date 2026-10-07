import { z } from 'zod'
import { parseBitcoinAddress } from '../shared/assets'
import { parseBtcToSats } from '../shared/utils/amount'

export const INVOICE_KEY_PREFIX = 'invoice:'

export const InvoiceSchema = z.object({
  id: z.string().min(1),
  amountSats: z.number().int().positive(),
  address: z.string().min(1),
  description: z.string().nullish(),
  createdAt: z.string(),
  paid: z.boolean().optional(),
})

export type InvoiceRecord = z.infer<typeof InvoiceSchema>

export const InvoiceFormSchema = z.object({
  address: z
    .string()
    .trim()
    .min(1, 'Enter a Bitcoin address')
    .refine((value) => parseBitcoinAddress(value) !== null, 'Not a valid mainnet Bitcoin address'),
  amountBtc: z
    .string()
    .refine((value) => {
      const sats = parseBtcToSats(value)
      return sats !== null && sats > 0
    }, 'Enter a valid amount')
    .transform((value) => parseBtcToSats(value) || 0),
  description: z.string().trim(),
})

export function parseInvoice(value: string): InvoiceRecord | null {
  try {
    const result = InvoiceSchema.safeParse(JSON.parse(value))
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export function encodeInvoice(record: InvoiceRecord): string {
  return JSON.stringify(record)
}

export function invoiceKey(id: string): string {
  return `${INVOICE_KEY_PREFIX}${id}`
}
