import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import { useNavigate } from '@tanstack/react-router'
import { parseInvoice, type InvoiceRecord } from '../schema'
import { useInvoices } from '../state/hooks'
import { InvoiceCard } from './InvoiceCard'

export const InvoiceList = () => {
  const navigate = useNavigate()
  const { entries, error, isConnecting, isFailed, removeInvoice, markPaid, retry } = useInvoices()

  const onNewInvoiceHandler = () => {
    navigate({ to: '/' })
  }

  const rows = entries
    .map((entry) => ({ key: entry.key, invoice: parseInvoice(entry.value) }))
    .filter((row): row is { key: string; invoice: InvoiceRecord } => row.invoice !== null)
    .sort((a, b) => {
      if (b.invoice.createdAt > a.invoice.createdAt) return 1
      if (b.invoice.createdAt < a.invoice.createdAt) return -1
      return 0
    })

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
          <Button color="inherit" onClick={() => retry()}>
            Retry
          </Button>
        }
      >
        {error ? error : 'Failed to load invoices'}
      </Alert>
    )
  }

  if (rows.length === 0) {
    return (
      <Stack spacing={2} sx={{ alignItems: 'center', paddingTop: 8 }}>
        <ReceiptLongIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
        <Typography color="text.secondary">No invoices yet</Typography>
        <Button variant="outlined" onClick={onNewInvoiceHandler}>
          New invoice
        </Button>
      </Stack>
    )
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
