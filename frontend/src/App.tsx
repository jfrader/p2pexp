import { Box, CssBaseline, Stack, styled, ThemeProvider, Typography } from '@mui/material'
import { InvoicesPage } from './invoices/InvoicesPage'
import { appTheme } from './theme'

const Topbar = styled(Box)(({ theme }) => ({
  minHeight: 64,
  maxHeight: 64,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
}))

const Content = styled(Stack)({
  flexGrow: 1,
  minHeight: 0,
  overflow: 'auto',
})

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Stack sx={{ height: '100vh', overflow: 'hidden' }}>
        <Topbar>
          <Typography variant="h6">p2pexp</Typography>
        </Topbar>
        <Content>
          <InvoicesPage />
        </Content>
      </Stack>
    </ThemeProvider>
  )
}

export default App
