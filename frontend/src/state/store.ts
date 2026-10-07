import { configureStore } from '@reduxjs/toolkit'
import invoicesReducer from '../invoices/state/slice'

export const store = configureStore({
  reducer: { invoices: invoicesReducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
