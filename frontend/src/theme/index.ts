import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: '#4caf50',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          '&:hover': { borderColor: theme.palette.primary.main },
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          justifyContent: 'flex-end',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiChip: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
})
