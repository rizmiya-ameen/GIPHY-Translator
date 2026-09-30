import React, { useState } from 'react'
import {
  Alert, Box, Button, Card, CardActions, CardContent, CardMedia, IconButton,
  Link, Skeleton, Snackbar, Stack, Tooltip, Typography,
} from '@mui/material'
import { CopyIcon, DownloadIcon, OpenInNewIcon, ShuffleIcon } from './icons'
import { getGifImage, MissingApiKeyError } from './utils'

const CARD_WIDTH = 480

const toFileName = (text) => (text || 'giphy').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'giphy'

const WordTranslator = ({ status, gif, error, phrase, onShuffle, onRetry }) => {
  const [toast, setToast] = useState(null)

  if (status === 'idle') {
    return (
      <Typography color="text.secondary" sx={{ py: 6 }}>
        Type something above and hit <strong>Translate</strong> to see it as a GIF.
      </Typography>
    )
  }

  if (status === 'error') {
    const isMissingKey = error instanceof MissingApiKeyError
    return (
      <Alert
        severity="error"
        sx={{ maxWidth: CARD_WIDTH, mx: 'auto', textAlign: 'left' }}
        action={!isMissingKey && <Button color="inherit" size="small" onClick={onRetry}>Retry</Button>}
      >
        {/* fetch rejects with a TypeError when the network is unreachable */}
        {error instanceof TypeError
          ? 'Could not reach GIPHY. Check your connection and try again.'
          : error.message}
      </Alert>
    )
  }

  if (status === 'empty') {
    return (
      <Alert severity="info" sx={{ maxWidth: CARD_WIDTH, mx: 'auto', textAlign: 'left' }}>
        No GIF found for “{phrase}”. Try a different word or phrase.
      </Alert>
    )
  }

  // While loading, keep showing the previous GIF dimmed if we have one, otherwise a skeleton
  const loading = status === 'loading'
  if (loading && !gif) {
    return (
      <Card sx={{ maxWidth: CARD_WIDTH, mx: 'auto' }} aria-busy="true">
        <Skeleton variant="rectangular" height={300} animation="wave" />
        <CardContent>
          <Skeleton width="70%" sx={{ mx: 'auto' }} />
        </CardContent>
      </Card>
    )
  }

  const image = getGifImage(gif)
  const author = gif.user?.display_name || gif.username

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(gif.url)
      setToast('Link copied to clipboard')
    } catch {
      setToast('Could not copy the link')
    }
  }

  const download = async () => {
    try {
      const response = await fetch(gif.images.original.url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${toFileName(phrase)}.gif`
      anchor.click()
      URL.revokeObjectURL(url)
    } catch {
      // Cross-origin download blocked — fall back to opening the file
      window.open(gif.images.original.url, '_blank', 'noopener')
    }
  }

  return (
    <>
      <Card
        elevation={6}
        sx={{ maxWidth: CARD_WIDTH, mx: 'auto', opacity: loading ? 0.5 : 1, transition: 'opacity 200ms' }}
        aria-busy={loading}
      >
        <Box sx={{ bgcolor: 'action.hover', display: 'flex', justifyContent: 'center' }}>
          <CardMedia
            component="img"
            src={image.url}
            alt={gif.title || phrase}
            width={image.width}
            height={image.height}
            sx={{ width: '100%', height: 'auto', maxHeight: 420, objectFit: 'contain' }}
          />
        </Box>

        <CardContent sx={{ pb: 1 }}>
          <Typography variant="overline" color="text.secondary">
            “{phrase}” translates to
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, lineHeight: 1.3 }}>
            {gif.title || 'Untitled GIF'}
          </Typography>
          {author && (
            <Typography variant="body2" color="text.secondary">
              by{' '}
              {gif.user?.profile_url ? (
                <Link href={gif.user.profile_url} target="_blank" rel="noopener noreferrer">{author}</Link>
              ) : author}
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button variant="outlined" startIcon={<ShuffleIcon />} onClick={onShuffle} disabled={loading}>
            Show another
          </Button>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Copy link">
              <IconButton aria-label="Copy link" onClick={copyLink}><CopyIcon /></IconButton>
            </Tooltip>
            <Tooltip title="Download GIF">
              <IconButton aria-label="Download GIF" onClick={download}><DownloadIcon /></IconButton>
            </Tooltip>
            <Tooltip title="Open on GIPHY">
              <IconButton aria-label="Open on GIPHY" href={gif.url} target="_blank" rel="noopener noreferrer">
                <OpenInNewIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardActions>
      </Card>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}

export default WordTranslator
