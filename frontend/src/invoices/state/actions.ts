import {
  encodeInvoice,
  InvoiceFormSchema,
  invoiceKey,
  type InvoiceRecord,
} from '../schema'
import { addEntry } from './hooks'
import type { AppDispatch } from '../../state/store'

export type NewInvoiceFormState = { error: string | null }

export async function submitInvoiceAction(
  dispatch: AppDispatch,
  _previous: NewInvoiceFormState,
  formData: FormData,
): Promise<NewInvoiceFormState> {
  const result = InvoiceFormSchema.safeParse({
    address: String(formData.get('address') || ''),
    amountBtc: String(formData.get('amountBtc') || ''),
    description: String(formData.get('description') || ''),
  })
  if (!result.success) return { error: result.error.issues[0].message }

  const record: InvoiceRecord = {
    id: crypto.randomUUID(),
    amountSats: result.data.amountBtc,
    address: result.data.address,
    description: result.data.description,
    createdAt: new Date().toISOString(),
    paid: false,
  }

  const message = await addEntry(dispatch, invoiceKey(record.id), encodeInvoice(record))
  return { error: message }
}
