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
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: 'auto',
          height: '100%',
          minHeight: 0,
        },
        indicator: {
          height: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 64,
          minWidth: 0,
          paddingLeft: theme.spacing(2.5),
          paddingRight: theme.spacing(2.5),
          textTransform: 'none',
          fontWeight: 600,
          color: theme.palette.text.secondary,
          '&:hover': { color: theme.palette.text.primary },
          '&.Mui-selected': { color: theme.palette.primary.main },
        }),
      },
    },
  },
})
