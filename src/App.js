import './App.css'
import React, { useMemo, useState } from 'react'
import {
  AppBar, Box, Container, CssBaseline, IconButton, Link, Stack, ThemeProvider, Toolbar, Tooltip, Typography, useMediaQuery,
} from '@mui/material'
import SearchBar from './SearchBar'
import WordTranslator from './WordTranslator'
import WeirdnessSlider from './WeirdnessSlider'
import RecentSearches from './RecentSearches'
import useGifTranslation from './useGifTranslation'
import useLocalStorage from './useLocalStorage'
import { createAppTheme } from './theme'
import { DarkModeIcon, LightModeIcon } from './icons'

const MAX_RECENT = 8

function App() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true })
  const [themeMode, setThemeMode] = useLocalStorage('giphy-translate:theme', null)
  const mode = themeMode ?? (prefersDark ? 'dark' : 'light')
  const theme = useMemo(() => createAppTheme(mode), [mode])

  const [weirdness, setWeirdness] = useState(0)
  const [recent, setRecent] = useLocalStorage('giphy-translate:recent', [])
  const { status, gif, error, phrase, translate, shuffle, retry } = useGifTranslation()

  const search = (text) => {
    translate(text, weirdness)
    setRecent((items) => [text, ...items.filter((item) => item !== text)].slice(0, MAX_RECENT))
  }

  const changeWeirdness = (value) => {
    setWeirdness(value)
    if (phrase) translate(phrase, value)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="App-glow" aria-hidden="true" />

        <AppBar position="static" color="transparent" elevation={0}>
          <Container maxWidth="md">
            <Toolbar disableGutters>
              <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
                GIPHY Translator
              </Typography>
              <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
                <IconButton
                  aria-label="Toggle dark mode"
                  edge="end"
                  onClick={() => setThemeMode(mode === 'dark' ? 'light' : 'dark')}
                >
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Toolbar>
          </Container>
        </AppBar>

        <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: { xs: 4, md: 6 }, textAlign: 'center' }}>
          {/* Stack resets child margins, so center children with alignItems rather than mx: 'auto' */}
          <Stack spacing={{ xs: 4, md: 5 }} alignItems="center" sx={{ '& > *': { width: '100%' } }}>
            <Box>
              <Typography variant="h2" component="h1" sx={{ fontSize: { xs: 40, md: 56 } }}>
                Say it with a{' '}
                <Box component="span" className="App-gradient-text">GIF</Box>
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: { md: 18 } }}>
                Turn any word or phrase into the perfect GIF — then crank up the weirdness.
              </Typography>
            </Box>

            <SearchBar phrase={phrase} onSearch={search} loading={status === 'loading'} />

            <WeirdnessSlider weirdness={weirdness} onChange={changeWeirdness} disabled={status === 'loading'} />

            <Box aria-live="polite">
              <WordTranslator
                status={status}
                gif={gif}
                error={error}
                phrase={phrase}
                onShuffle={shuffle}
                onRetry={retry}
              />
            </Box>

            <RecentSearches
              items={recent}
              onSelect={search}
              onRemove={(item) => setRecent((items) => items.filter((i) => i !== item))}
              onClear={() => setRecent([])}
            />
          </Stack>
        </Container>

        <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Powered by{' '}
            <Link href="https://giphy.com" target="_blank" rel="noopener noreferrer" fontWeight={600}>
              GIPHY
            </Link>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
