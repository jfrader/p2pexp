import { Stack, Typography } from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'
import type { Asset } from '../../definitions/assets'
import type { InvoiceRecord } from '../schema'

type InvoicePaymentProps = {
  invoice: InvoiceRecord
  asset: Asset
}

export const InvoicePayment = ({ invoice, asset }: InvoicePaymentProps) => {
  const isPaid = invoice.paid === true

  return (
    <Stack
      spacing={1}
      sx={{ alignItems: 'flex-start', justifyContent: 'space-between', height: '100%' }}
    >
      <QRCodeSVG
        value={asset.paymentUri(invoice.address, invoice.total)}
        size={180}
        level="M"
        marginSize={2}
        style={isPaid ? { opacity: 0.4, borderRadius: 8 } : { borderRadius: 8 }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ width: '100%', textAlign: 'center' }}
      >
        Scan to pay
      </Typography>
    </Stack>
  )
}
