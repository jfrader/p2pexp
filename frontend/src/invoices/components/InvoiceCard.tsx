import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CheckIcon from '@mui/icons-material/Check'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { QRCodeSVG } from 'qrcode.react'
import { formatSats, satsToBtc } from '../../shared/utils/amount'
import { buildBip21, inspectUrl } from '../../shared/utils/uri'
import type { InvoiceRecord } from '../schema'
import { CopyTextButton } from '../../shared/components/ui/CopyTextButton'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

type InvoiceCardProps = {
  invoice: InvoiceRecord
  onMarkPaid: () => void
  onRemove: () => void
}

export const InvoiceCard = ({ invoice, onMarkPaid, onRemove }: InvoiceCardProps) => {
  const isPaid = invoice.paid === true

  return (
    <Card sx={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <Box
        sx={{
          padding: 1,
          backgroundColor: '#ffffff',
          borderRadius: 1,
          lineHeight: 0,
          opacity: isPaid ? 0.4 : 1,
        }}
      >
        <QRCodeSVG
          value={buildBip21(invoice.address, invoice.amountSats, invoice.description || undefined)}
          size={152}
          level="M"
          marginSize={2}
        />
      </Box>

      <Stack spacing={1.5} sx={{ flexGrow: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Chip
            label={isPaid ? 'Paid' : 'Open'}
            size="small"
            color={isPaid ? 'primary' : 'default'}
          />
          <Chip label="Bitcoin" size="small" variant="outlined" />
          <Chip label="Bitcoin mainnet" size="small" variant="outlined" />
        </Stack>

        <Typography variant="h5">{formatSats(invoice.amountSats)}</Typography>
        <Typography variant="body2" color="text.secondary">
          {satsToBtc(invoice.amountSats)} BTC
        </Typography>

        {invoice.description ? <Typography>{invoice.description}</Typography> : null}

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography
            title={invoice.address}
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 360,
            }}
          >
            {invoice.address}
          </Typography>
          <CopyTextButton text={invoice.address} aria-label="Copy destination" />
          <Button
            size="small"
            href={inspectUrl(invoice)}
            target="_blank"
            rel="noreferrer"
            aria-label="Inspect on mempool.space"
            sx={{ minWidth: 0, padding: 1 }}
          >
            <OpenInNewIcon fontSize="small" />
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {dateFormatter.format(new Date(invoice.createdAt))}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ marginLeft: 'auto' }}>
            {!isPaid ? (
              <Button size="small" startIcon={<CheckIcon />} onClick={onMarkPaid}>
                Mark as paid
              </Button>
            ) : null}
            <Button
              size="small"
              color="error"
              startIcon={<DeleteOutlinedIcon />}
              onClick={onRemove}
            >
              Remove
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  )
}
