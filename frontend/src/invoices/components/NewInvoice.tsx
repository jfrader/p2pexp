import { Alert, Button, Card, Stack, TextField } from '@mui/material'
import { useActionState } from 'react'
import { useAppDispatch } from '../../state/hooks'
import { submitInvoiceAction, type NewInvoiceFormState } from '../state/actions'
import { useInvoices } from '../state/hooks'

const DESCRIPTION_MAX_LENGTH = 240

export const NewInvoice = () => {
  const dispatch = useAppDispatch()
  const { isReady } = useInvoices()

  const [state, formAction, isPending] = useActionState(
    (previous: NewInvoiceFormState, formData: FormData) =>
      submitInvoiceAction(dispatch, previous, formData),
    { error: null },
  )

  return (
    <form action={formAction}>
      <Card>
        <Stack direction={{ sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
          <TextField
            label="Bitcoin address"
            name="address"
            variant="outlined"
            sx={{ flexGrow: 2, minWidth: 280 }}
          />
          <TextField
            label="Amount (BTC)"
            name="amountBtc"
            variant="outlined"
            sx={{ minWidth: 200 }}
          />
        </Stack>

        <TextField
          label="Description (optional)"
          name="description"
          variant="outlined"
          slotProps={{ htmlInput: { maxLength: DESCRIPTION_MAX_LENGTH } }}
          fullWidth
        />

        {state.error !== null ? <Alert severity="error">{state.error}</Alert> : null}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!isReady || isPending}
          sx={{ alignSelf: 'flex-start' }}
        >
          Share invoice
        </Button>
      </Card>
    </form>
  )
}
