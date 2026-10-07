import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  cssVariables: true,
  palette: {
    background: {
      default: '#f5f6f8',
      paper: '#ffffff',
    },
    divider: '#e3e6eb',
    primary: {
      main: '#093b14',
    },
    text: {
      primary: '#1c2536',
      secondary: '#5b6577',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(2),
          padding: theme.spacing(3),
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        }),
      },
    },
  },
})
