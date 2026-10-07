import { CssBaseline, ThemeProvider } from '@mui/material'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { appTheme } from './theme'

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
