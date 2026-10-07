import { z } from 'zod'
import { ASSETS } from '../definitions/assets'

const bitcoin = ASSETS['btc-onchain']

export const INVOICE_KEY_PREFIX = 'invoice:'

const validAmount = z
  .string()
  .refine((value) => bitcoin.validateAmount(value) !== null, 'Enter a valid amount')

export const InvoiceSchema = z.object({
  id: z.string().min(1),
  asset: z.enum(['btc-onchain']),
  total: validAmount,
  address: z.string().min(1),
  description: z.string().nullish(),
  number: z.string().nullish(),
  date: z.string().nullish(),
  from: z.string().nullish(),
  to: z.string().nullish(),
  createdAt: z.string(),
  paid: z.boolean().optional(),
})

export type InvoiceRecord = z.infer<typeof InvoiceSchema>

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === '' ? null : value))

export const InvoiceFormSchema = z.object({
  total: validAmount.transform((value) => bitcoin.validateAmount(value) || ''),
  address: z
    .string()
    .trim()
    .min(1, 'Enter a Bitcoin address')
    .refine((value) => bitcoin.parseAddress(value) !== null, 'Invalid address'),
  number: optionalText,
  date: optionalText,
  from: optionalText,
  to: optionalText,
  description: optionalText,
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
