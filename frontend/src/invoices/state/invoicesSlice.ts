import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { requestAddEntry, requestListEntries, requestRemoveEntry } from '../../bridge'
import { errorMessage } from '../../shared/utils/error'
import type { AppDispatch } from '../../state/store'

export type Entry = { key: string; value: string }

type InvoicesState = {
  status: 'connecting' | 'ready' | 'error'
  entries: Entry[]
  error: string | null
}

const initialState: InvoicesState = {
  status: 'connecting',
  entries: [],
  error: null,
}

export const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    entriesReceived(state, action: PayloadAction<Entry[]>) {
      state.status = 'ready'
      state.entries = action.payload
      state.error = null
    },
    failed(state, action: PayloadAction<string>) {
      state.status = 'error'
      state.error = action.payload
    },
  },
})

export async function addEntry(
  dispatch: AppDispatch,
  key: string,
  value: string,
): Promise<string | null> {
  try {
    await requestAddEntry(key, value)
    return null
  } catch (cause) {
    const message = errorMessage(cause)
    dispatch(invoicesSlice.actions.failed(message))
    return message
  }
}

export async function removeEntry(dispatch: AppDispatch, key: string) {
  try {
    await requestRemoveEntry(key)
  } catch (cause) {
    dispatch(invoicesSlice.actions.failed(errorMessage(cause)))
  }
}

export async function listEntries(dispatch: AppDispatch) {
  try {
    await requestListEntries()
  } catch (cause) {
    dispatch(invoicesSlice.actions.failed(errorMessage(cause)))
  }
}
