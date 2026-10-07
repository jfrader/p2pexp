import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useActionState, useState, type ChangeEvent } from 'react'
import dayjs from 'dayjs'
import { ASSETS } from '../../definitions/assets'
import { useAppDispatch } from '../../state/hooks'
import { submitInvoiceAction, type InvoiceFormState } from './submitInvoiceAction'
import { useInvoices } from '../state/hooks'

const bitcoin = ASSETS['btc-onchain']

type FormFields = {
  number: string
  date: string
  from: string
  to: string
  total: string
  address: string
  description: string
}

const createInvoiceNumber = () => `INV-${Date.now().toString(36).toUpperCase()}`

export const InvoiceForm = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isReady } = useInvoices()
  const [fields, setFields] = useState<FormFields>({
    number: createInvoiceNumber(),
    date: dayjs().format('YYYY-MM-DD'),
    from: '',
    to: '',
    total: '',
    address: '',
    description: '',
  })

  const onFieldChangeHandler =
    (field: keyof FormFields) => (event: ChangeEvent<HTMLInputElement>) => {
      setFields((current) => ({ ...current, [field]: event.target.value }))
    }

  const [state, formAction, isPending] = useActionState(
    (previous: InvoiceFormState, formData: FormData) =>
      submitInvoiceAction(previous, formData, dispatch, () => navigate({ to: '/invoices' })),
    { error: null, field: null },
  )

  const fieldError = (name: string) => {
    if (state.field === name && state.error !== null) return state.error
    return undefined
  }

  const total = bitcoin.validateAmount(fields.total) || ''

  return (
    <form action={formAction} noValidate>
      <Card>
        <CardHeader title="New invoice" />
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="overline" color="text.secondary">
              Required Fields
            </Typography>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={fields.date}
              onChange={onFieldChangeHandler('date')}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Bitcoin address"
              required
              name="address"
              value={fields.address}
              onChange={onFieldChangeHandler('address')}
              error={fieldError('address') !== undefined}
              helperText={fieldError('address')}
            />
            <TextField
              label={`Amount (${bitcoin.currency})`}
              required
              name="total"
              value={fields.total}
              onChange={onFieldChangeHandler('total')}
              error={fieldError('total') !== undefined}
              helperText={fieldError('total')}
            />
            {total !== '' ? (
              <Typography variant="body2" color="text.secondary">
                {`${total} ${bitcoin.currency}`}
              </Typography>
            ) : null}
            <Typography variant="overline" color="text.secondary">
              Optional Fields
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Invoice number"
                name="number"
                value={fields.number}
                onChange={onFieldChangeHandler('number')}
              />
              <TextField
                label="Description"
                name="description"
                value={fields.description}
                onChange={onFieldChangeHandler('description')}
              />
              <TextField
                label="Your name"
                name="from"
                value={fields.from}
                onChange={onFieldChangeHandler('from')}
              />
              <TextField
                label="Customer name"
                name="to"
                value={fields.to}
                onChange={onFieldChangeHandler('to')}
              />
            </Stack>

            {state.field === null && state.error !== null ? (
              <Alert severity="error">{state.error}</Alert>
            ) : null}
          </Stack>
        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained" size="large" disabled={!isReady || isPending}>
            Save
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}
