import { createRoute } from '@tanstack/react-router'
import { InvoiceForm } from '../invoices/components/InvoiceForm'
import { rootRoute } from './__root'

export const newInvoiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: InvoiceForm,
})
