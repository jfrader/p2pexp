import { useAppDispatch, useAppSelector } from '../../state/hooks'
import { addEntry, listEntries, removeEntry } from './invoicesSlice'
import { encodeInvoice, type InvoiceRecord } from '../schema'

export function useInvoices() {
  const dispatch = useAppDispatch()
  const { status, entries, error } = useAppSelector((state) => state.invoices)

  return {
    entries,
    error,
    isConnecting: status === 'connecting',
    isFailed: status === 'error',
    isReady: status === 'ready',
    removeInvoice: (key: string) => {
      return removeEntry(dispatch, key)
    },
    markPaid: (key: string, invoice: InvoiceRecord) => {
      return addEntry(dispatch, key, encodeInvoice({ ...invoice, paid: true }))
    },
    retry: () => {
      return listEntries(dispatch)
    },
  }
}
