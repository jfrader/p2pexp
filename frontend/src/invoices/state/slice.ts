import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Entry = { key: string; value: string }

type AutopassState = {
  status: 'connecting' | 'ready' | 'error'
  entries: Entry[]
  error: string | null
}

const initialState: AutopassState = {
  status: 'connecting',
  entries: [],
  error: null,
}

const autopassSlice = createSlice({
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

export const { entriesReceived, failed } = autopassSlice.actions
export default autopassSlice.reducer
