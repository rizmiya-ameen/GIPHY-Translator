import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Chip, CircularProgress, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { CloseIcon, SearchIcon } from './icons'

const SUGGESTIONS = ['happy friday', 'mind blown', 'thank you', 'nope', 'coffee time', 'deal with it']
const MAX_LENGTH = 50

const SearchBar = ({ phrase, onSearch, loading }) => {
  const [word, setWord] = useState('')
  const inputRef = useRef(null)
  const trimmed = word.trim()

  // Reflect searches started elsewhere (suggestions, recent searches) in the input
  useEffect(() => setWord(phrase), [phrase])

  // Press "/" anywhere to jump to the search box
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== '/' || event.target.closest('input, textarea')) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} role="search" sx={{ width: '100%', maxWidth: 640, mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          fullWidth
          inputRef={inputRef}
          label="Enter a word or phrase"
          placeholder="e.g. good morning"
          value={word}
          onChange={(event) => setWord(event.target.value)}
          inputProps={{ maxLength: MAX_LENGTH, 'aria-label': 'Word or phrase to translate' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: word && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear"
                  edge="end"
                  size="small"
                  onClick={() => {
                    setWord('')
                    inputRef.current?.focus()
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!trimmed || loading}
          sx={{ px: 4, minHeight: 56, fontSize: 17, flexShrink: 0 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" aria-label="Loading" /> : 'Translate'}
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Try:
        </Typography>
        {SUGGESTIONS.map((suggestion) => (
          <Chip
            key={suggestion}
            label={suggestion}
            size="small"
            variant="outlined"
            onClick={() => onSearch(suggestion)}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default SearchBar
