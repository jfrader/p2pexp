import { Box, Stack, styled, Tab, Tabs, Typography } from '@mui/material'
import { createRootRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { type SyntheticEvent } from 'react'

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

const Screen = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}))

export const rootRoute = createRootRoute({
  component: function RootLayout() {
    const navigate = useNavigate()
    const pathname = useRouterState({ select: (state) => state.location.pathname })

    const onTabChangeHandler = (_event: SyntheticEvent, value: '/' | '/invoices') => {
      navigate({ to: value })
    }

    return (
      <Stack sx={{ height: '100vh', overflow: 'hidden' }}>
        <Topbar>
          <Typography variant="h6">p2pexp</Typography>
          <Tabs
            value={pathname === '/invoices' ? '/invoices' : '/'}
            onChange={onTabChangeHandler}
            sx={{
              ml: 'auto',
              height: '100%',
              minHeight: 0,
              '& .MuiTab-root': {
                minHeight: 64,
                minWidth: 0,
                paddingX: 2.5,
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
              },
              '& .Mui-selected': { color: 'primary.main' },
              '& .MuiTabs-indicator': { height: 2 },
            }}
          >
            <Tab label="New invoice" value="/" />
            <Tab label="Invoices" value="/invoices" />
          </Tabs>
        </Topbar>
        <Content>
          <Screen>
            <Outlet />
          </Screen>
        </Content>
      </Stack>
    )
  },
})
