import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { parseInvoice, type InvoiceRecord } from '../schema'
import { useInvoices } from '../state/hooks'
import { InvoiceCard } from './InvoiceCard'

export const InvoiceList = () => {
  const { entries, error, isConnecting, isFailed, removeInvoice, markPaid, retry } = useInvoices()

  const rows = entries
    .map((entry) => ({ key: entry.key, invoice: parseInvoice(entry.value) }))
    .filter((row): row is { key: string; invoice: InvoiceRecord } => row.invoice !== null)
    .sort((a, b) => (b.invoice.createdAt > a.invoice.createdAt ? 1 : -1))

  if (isConnecting) {
    return (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">
          Loading invoices…
        </Typography>
      </Stack>
    )
  }

  if (isFailed) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => retry()}>
            Retry
          </Button>
        }
      >
        {error ? error : 'Failed to load invoices'}
      </Alert>
    )
  }

  if (rows.length === 0) {
    return <Typography color="text.secondary">No invoices yet</Typography>
  }

  return (
    <Stack spacing={2}>
      {rows.map(({ key, invoice }) => (
        <InvoiceCard
          key={key}
          invoice={invoice}
          onMarkPaid={() => markPaid(key, invoice)}
          onRemove={() => removeInvoice(key)}
        />
      ))}
    </Stack>
  )
}
