import { configureStore } from '@reduxjs/toolkit'
import { invoicesSlice } from '../invoices/state/invoicesSlice'

export const store = configureStore({
  reducer: { invoices: invoicesSlice.reducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
