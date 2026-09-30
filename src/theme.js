import { createTheme } from '@mui/material'

const headingFont = 'Sniglet, "Poppins", sans-serif'

export function createAppTheme(mode) {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? '#a78bfa' : '#6d28d9' },
      secondary: { main: isDark ? '#67e8f9' : '#0891b2' },
      background: {
        default: isDark ? '#0f0d17' : '#f7f5ff',
        paper: isDark ? '#1a1726' : '#ffffff',
      },
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: '"Poppins", system-ui, -apple-system, "Segoe UI", sans-serif',
      h1: { fontFamily: headingFont, fontWeight: 400 },
      h2: { fontFamily: headingFont, fontWeight: 400 },
      h6: { fontFamily: headingFont, fontWeight: 400 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
    },
  })
}
