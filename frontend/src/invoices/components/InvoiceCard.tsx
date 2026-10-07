import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import CheckIcon from '@mui/icons-material/Check'
import LinkIcon from '@mui/icons-material/Link'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import dayjs from 'dayjs'
import { ASSETS } from '../../definitions/assets'
import type { InvoiceRecord } from '../schema'
import { CopyTextButton } from '../../shared/components/CopyTextButton'
import { InvoicePayment } from './InvoicePayment'

type InvoiceCardProps = {
  invoice: InvoiceRecord
  onMarkPaid: () => void
  onRemove: () => void
}

export const InvoiceCard = ({ invoice, onMarkPaid, onRemove }: InvoiceCardProps) => {
  const asset = ASSETS[invoice.asset]
  const isPaid = invoice.paid === true
  const inspectUrl = asset.inspectUrl ? asset.inspectUrl(invoice.address) : null

  const onMarkPaidHandler = () => {
    if (window.confirm('Mark this invoice as paid?')) onMarkPaid()
  }

  const onRemoveHandler = () => {
    if (window.confirm('Remove this invoice?')) onRemove()
  }

  return (
    <Card>
      <CardHeader
        title={invoice.number || 'Invoice'}
        subheader={
          invoice.date || (invoice.from && invoice.to) ? (
            <Stack direction="row" spacing={1}>
              {invoice.date ? <span>{invoice.date}</span> : null}
              {invoice.from && invoice.to ? (
                <span>
                  {invoice.from} → {invoice.to}
                </span>
              ) : null}
            </Stack>
          ) : undefined
        }
        action={
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip label={isPaid ? 'Paid' : 'Open'} color={isPaid ? 'success' : 'secondary'} />
            <Chip label={asset.label} variant="outlined" />
            <Chip label={asset.network} variant="outlined" />
          </Stack>
        }
      />
      <CardContent>
        <Stack direction="row" spacing={3}>
          <InvoicePayment invoice={invoice} asset={asset} />
          <Stack spacing={1.5} sx={{ flexGrow: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography
                title={invoice.address}
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 320,
                }}
              >
                {invoice.address}
              </Typography>
              <CopyTextButton text={invoice.address} aria-label="Copy destination" />
              {inspectUrl !== null ? (
                <Tooltip title={asset.inspectLabel || 'Inspect Address'}>
                  <a
                    href={inspectUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Inspect on mempool.space"
                    style={{ display: 'flex' }}
                  >
                    <IconButton>
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </a>
                </Tooltip>
              ) : null}
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography
                variant="h4"
                sx={{ color: isPaid ? 'primary.main' : 'secondary.main', fontWeight: 600 }}
              >
                {`${invoice.total} ${asset.currency}`}
              </Typography>
              {isPaid ? (
                <Avatar sx={{ bgcolor: 'success.main', width: 24, height: 24 }}>
                  <CheckIcon sx={{ fontSize: 16 }} />
                </Avatar>
              ) : null}
            </Stack>
            {invoice.description ? (
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body2">{invoice.description}</Typography>
              </Stack>
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          {dayjs(invoice.createdAt).format('MMM D, YYYY HH:mm')}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<CheckIcon />} onClick={onMarkPaidHandler} disabled={isPaid}>
            Mark as paid
          </Button>
          <Button disabled startIcon={<PictureAsPdfIcon />}>
            PDF
          </Button>
          <Button disabled startIcon={<LinkIcon />}>
            Share to Pear
          </Button>
          <Button color="error" startIcon={<DeleteOutlinedIcon />} onClick={onRemoveHandler}>
            Remove
          </Button>
        </Stack>
      </CardActions>
    </Card>
  )
}
