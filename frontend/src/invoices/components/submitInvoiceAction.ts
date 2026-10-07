import dayjs from 'dayjs'
import { encodeInvoice, InvoiceFormSchema, invoiceKey, type InvoiceRecord } from '../schema'
import { ASSETS } from '../../definitions/assets'
import { addEntry } from '../state/invoicesSlice'
import type { AppDispatch } from '../../state/store'

export type InvoiceFormState = { error: string | null; field: string | null }

export async function submitInvoiceAction(
  _previous: InvoiceFormState,
  formData: FormData,
  dispatch: AppDispatch,
  onSaved: () => void,
): Promise<InvoiceFormState> {
  const result = InvoiceFormSchema.safeParse({
    total: String(formData.get('total') || ''),
    address: String(formData.get('address') || ''),
    number: String(formData.get('number') || ''),
    date: String(formData.get('date') || ''),
    from: String(formData.get('from') || ''),
    to: String(formData.get('to') || ''),
    description: String(formData.get('description') || ''),
  })
  if (!result.success) {
    const issue = result.error.issues[0]
    return { error: issue.message, field: (issue.path[0] as string | undefined) || null }
  }

  const { total, address, ...details } = result.data

  const record: InvoiceRecord = {
    id: crypto.randomUUID(),
    asset: ASSETS['btc-onchain'].id,
    total,
    address,
    ...details,
    createdAt: dayjs().toISOString(),
    paid: false,
  }

  const error = await addEntry(dispatch, invoiceKey(record.id), encodeInvoice(record))
  if (error === null) onSaved()
  return { error, field: null }
}
