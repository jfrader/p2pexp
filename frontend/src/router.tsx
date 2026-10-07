import { createHashHistory, createRouter } from '@tanstack/react-router'
import { rootRoute } from './routes/__root'
import { newInvoiceRoute } from './routes/new-invoice'
import { invoicesRoute } from './routes/invoices'

const hashHistory = createHashHistory()
const routeTree = rootRoute.addChildren([newInvoiceRoute, invoicesRoute])

export const router = createRouter({ routeTree, history: hashHistory })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
