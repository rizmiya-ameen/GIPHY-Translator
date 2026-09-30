import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { clearSearchCache, gifForWeirdness, randomGifFor } from './utils';

const gif = {
  id: 'abc123',
  title: 'Happy Dance GIF',
  url: 'https://giphy.com/gifs/abc123',
  images: {
    original: { url: 'https://media.giphy.com/original.gif', width: '480', height: '270' },
    downsized_medium: { url: 'https://media.giphy.com/medium.gif', width: '480', height: '270' },
  },
};

const mockFetchResponse = (data) =>
  jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ data }) });

beforeEach(() => {
  process.env.REACT_APP_GIPHY_API_KEY = 'test-key';
  window.localStorage.clear();
  clearSearchCache();
});

afterEach(() => {
  delete global.fetch;
});

test('does not call the API before the user searches', () => {
  global.fetch = mockFetchResponse(gif);
  render(<App />);

  expect(screen.getByRole('heading', { name: /say it with a gif/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /translate/i })).toBeDisabled();
  expect(global.fetch).not.toHaveBeenCalled();
});

test('translates a phrase and shows the GIF', async () => {
  global.fetch = mockFetchResponse([gif]);
  render(<App />);

  userEvent.type(screen.getByLabelText(/word or phrase to translate/i), 'cats & dogs{enter}');

  expect(await screen.findByAltText('Happy Dance GIF')).toBeInTheDocument();
  const url = new URL(global.fetch.mock.calls[0][0]);
  expect(url.pathname).toBe('/v1/gifs/search');
  expect(url.searchParams.get('q')).toBe('cats & dogs');
  expect(screen.getByRole('button', { name: /cats & dogs/i })).toBeInTheDocument(); // recent search chip
});

describe('weirdness', () => {
  const results = Array.from({ length: 50 }, (_, i) => ({ id: `gif-${i}` }));

  test('higher weirdness picks GIFs further down the relevance ranking', async () => {
    global.fetch = mockFetchResponse(results);

    const ids = [];
    for (let weirdness = 0; weirdness <= 10; weirdness++) {
      ids.push((await gifForWeirdness('cats', weirdness)).id);
    }

    expect(ids[0]).toBe('gif-0');
    expect(new Set(ids).size).toBe(11); // every level shows a different GIF
    expect(global.fetch).toHaveBeenCalledTimes(1); // one search is reused for every level
  });

  test('works when there are fewer results than weirdness levels', async () => {
    global.fetch = mockFetchResponse(results.slice(0, 3));

    expect((await gifForWeirdness('rare', 0)).id).toBe('gif-0');
    expect((await gifForWeirdness('rare', 10)).id).toBe('gif-2');
  });

  test('"show another" never repeats the current GIF', async () => {
    global.fetch = mockFetchResponse(results.slice(0, 2));

    for (let i = 0; i < 10; i++) {
      expect((await randomGifFor('two', 0, 'gif-0')).id).toBe('gif-1');
    }
  });
});

test('shows a friendly message when no GIF matches', async () => {
  global.fetch = mockFetchResponse([]);
  render(<App />);

  userEvent.type(screen.getByLabelText(/word or phrase to translate/i), 'zzzz{enter}');

  expect(await screen.findByText(/no gif found/i)).toBeInTheDocument();
});

test('shows an error with a retry button when the request fails', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
  jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<App />);

  userEvent.type(screen.getByLabelText(/word or phrase to translate/i), 'hello{enter}');

  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/request failed/i));
  expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  console.error.mockRestore();
});

test('explains how to fix a missing API key', async () => {
  delete process.env.REACT_APP_GIPHY_API_KEY;
  global.fetch = mockFetchResponse(gif);
  jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<App />);

  userEvent.type(screen.getByLabelText(/word or phrase to translate/i), 'hello{enter}');

  expect(await screen.findByText(/REACT_APP_GIPHY_API_KEY/)).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
  console.error.mockRestore();
});
