import { useAppDispatch, useAppSelector } from '../../state/hooks'
import { requestAddEntry, requestListEntries, requestRemoveEntry } from '../../autopass/bridge'
import { failed } from './slice'
import { encodeInvoice, invoiceKey, type InvoiceRecord } from '../schema'
import { errorMessage } from '../../shared/utils/error'
import type { AppDispatch } from '../../state/store'

async function addEntry(dispatch: AppDispatch, key: string, value: string): Promise<string | null> {
  try {
    await requestAddEntry(key, value)
    return null
  } catch (cause) {
    const message = errorMessage(cause)
    dispatch(failed(message))
    return message
  }
}

async function removeEntry(dispatch: AppDispatch, key: string) {
  try {
    await requestRemoveEntry(key)
  } catch (cause) {
    dispatch(failed(errorMessage(cause)))
  }
}

async function listEntries(dispatch: AppDispatch) {
  try {
    await requestListEntries()
  } catch (cause) {
    dispatch(failed(errorMessage(cause)))
  }
}

export { addEntry }

export function useInvoices() {
  const dispatch = useAppDispatch()
  const { status, entries, error } = useAppSelector((state) => state.invoices)

  return {
    status,
    entries,
    error,
    isConnecting: status === 'connecting',
    isFailed: status === 'error',
    isReady: status === 'ready',
    addInvoice: (record: InvoiceRecord) => {
      return addEntry(dispatch, invoiceKey(record.id), encodeInvoice(record))
    },
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
