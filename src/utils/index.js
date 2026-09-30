const API_BASE = 'https://api.giphy.com/v1/gifs'

// GIPHY's translate endpoint ignores its `weirdness` parameter (it returns the same GIF at every level),
// so weirdness is implemented here instead: results come back ranked by relevance, and the higher the
// weirdness, the further down that ranking we pick from.
const RESULTS_PER_PHRASE = 50
const MAX_WEIRDNESS = 10
const MAX_CACHED_PHRASES = 20

export class MissingApiKeyError extends Error {
  constructor() {
    super('GIPHY API key is missing. Add REACT_APP_GIPHY_API_KEY to your .env.local file and restart the dev server.')
    this.name = 'MissingApiKeyError'
  }
}

function getApiKey() {
  const key = process.env.REACT_APP_GIPHY_API_KEY
  if (!key) throw new MissingApiKeyError()
  return key
}

async function request(endpoint, params) {
  const query = new URLSearchParams({ ...params, api_key: getApiKey() })
  const response = await fetch(`${API_BASE}/${endpoint}?${query}`)
  if (!response.ok) {
    throw new Error(
      response.status === 429
        ? 'GIPHY rate limit reached. Please wait a moment and try again.'
        : `GIPHY request failed (${response.status}).`
    )
  }
  const json = await response.json()
  return json.data
}

// One search per phrase, shared by every weirdness level and shuffle, so moving the slider is instant
const searchCache = new Map()

function searchResults(phrase) {
  const key = phrase.toLowerCase()
  if (!searchCache.has(key)) {
    const results = request('search', { q: phrase, limit: RESULTS_PER_PHRASE })
      .then((data) => (Array.isArray(data) ? data.filter((gif) => gif && gif.id) : []))
    results.catch(() => searchCache.delete(key)) // Don't cache failures
    searchCache.set(key, results)
    if (searchCache.size > MAX_CACHED_PHRASES) searchCache.delete(searchCache.keys().next().value)
  }
  return searchCache.get(key)
}

export function clearSearchCache() {
  searchCache.clear()
}

// Range of result positions that belong to a weirdness level: 0 → top match, 10 → deepest result
function weirdnessRange(weirdness, count) {
  const perLevel = count / (MAX_WEIRDNESS + 1)
  const start = Math.min(Math.floor(weirdness * perLevel), count - 1)
  const end = Math.max(start + 1, Math.floor((weirdness + 1) * perLevel))
  return [start, end]
}

export async function gifForWeirdness(phrase, weirdness) {
  const results = await searchResults(phrase)
  if (results.length === 0) return null
  const [start] = weirdnessRange(weirdness, results.length)
  return results[start]
}

// Random GIF from the same weirdness level, skipping the one currently shown
export async function randomGifFor(phrase, weirdness, excludeId) {
  const results = await searchResults(phrase)
  const [start, end] = weirdnessRange(weirdness, results.length)
  const pick = (list) => list[Math.floor(Math.random() * list.length)]

  const sameLevel = results.slice(start, end).filter((gif) => gif.id !== excludeId)
  if (sameLevel.length > 0) return pick(sameLevel)

  // Level has only one GIF (short result list) — fall back to any other result
  const others = results.filter((gif) => gif.id !== excludeId)
  return others.length > 0 ? pick(others) : null
}

export function getGifImage(gif) {
  const { images = {} } = gif
  return images.downsized_medium || images.downsized || images.original
}
