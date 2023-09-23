const GIPHY_API_KEY = process.env.REACT_APP_GIPHY_API_KEY


export async function getGiphy (phrase,weirdness) {
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/translate?s=happy&weirdness=1&api_key=${GIPHY_API_KEY}`)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json()
    return data.data;
  } catch (error) {
    console.error("Erro fetching data", error);
    throw error;
  }
}
