import { useCallback, useEffect, useState } from 'react'
import { gifForWeirdness, randomGifFor } from './utils'

const initialResult = { status: 'idle', gif: null, error: null }

// Each request carries a unique id so re-submitting the same phrase still triggers a fetch
let nextRequestId = 0

export default function useGifTranslation() {
  const [request, setRequest] = useState(null)
  const [result, setResult] = useState(initialResult)

  useEffect(() => {
    if (!request) return

    // Requests are shared through a cache, so rather than aborting them we ignore stale responses
    let stale = false
    const { phrase, weirdness, mode, excludeId } = request

    setResult((prev) => ({ ...prev, status: 'loading', error: null }))

    const fetchGif = mode === 'shuffle'
      ? randomGifFor(phrase, weirdness, excludeId)
      : gifForWeirdness(phrase, weirdness)

    fetchGif
      .then((gif) => {
        if (stale) return
        setResult(gif
          ? { status: 'success', gif, error: null }
          : { status: 'empty', gif: null, error: null })
      })
      .catch((error) => {
        if (stale) return
        console.error('Error fetching GIF', error)
        setResult({ status: 'error', gif: null, error })
      })

    return () => {
      stale = true
    }
  }, [request])

  const translate = useCallback((phrase, weirdness) => {
    setRequest({ id: nextRequestId++, mode: 'translate', phrase, weirdness })
  }, [])

  const shuffle = useCallback(() => {
    setRequest((prev) => prev && {
      ...prev,
      id: nextRequestId++,
      mode: 'shuffle',
      excludeId: result.gif?.id,
    })
  }, [result.gif])

  const retry = useCallback(() => {
    setRequest((prev) => prev && { ...prev, id: nextRequestId++ })
  }, [])

  return {
    ...result,
    phrase: request?.phrase ?? '',
    translate,
    shuffle,
    retry,
  }
}
