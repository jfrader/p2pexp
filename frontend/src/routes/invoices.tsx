import { createRoute } from '@tanstack/react-router'
import { InvoiceList } from '../invoices/components/InvoiceList'
import { rootRoute } from './__root'

export const invoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invoices',
  component: InvoiceList,
})
