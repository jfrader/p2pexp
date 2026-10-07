import { Box, Stack, styled, Typography } from '@mui/material'
import { InvoiceList } from './components/InvoiceList'
import { NewInvoice } from './components/NewInvoice'

const Screen = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  minHeight: 0,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}))

export const InvoicesPage = () => (
  <Screen>
    <Stack spacing={3}>
      <Typography variant="h5">Payment requests</Typography>
      <NewInvoice />
      <InvoiceList />
    </Stack>
  </Screen>
)
