import { useState } from 'react'

const GIPHY_API_KEY = process.env.REACT_APP_GIPHY_API_KEY

function GiphyTranslate () {

  const [giphy, setGiphy] = useState({})
  const [phrase, setPhrase] = useState('')
  const [weirdness, setWeirdness] = useState(0)

  const getGiphy = () => {
    fetch(`https://api.giphy.com/v1/gifs/translate?s=${phrase}&weirdness=${weirdness}&api_key=${GIPHY_API_KEY}`)
    .then(res => res.json())
    .then(res => setGiphy(res.data))
  //.then(res => console.log(res.data))
  }

  const handlePhraseChange = (event) => {
    setPhrase(event.target.value)
    //console.log(phrase)
  }

  const handleWeirdness = (event) => {
    setWeirdness(event.target.value);
    getGiphy();
    //console.log(weirdness)
  }


  return (
    <div className="GiphyTranslate">

        <h1 className='heading'>GIPHY Translate</h1>

        <input className='search-bar' type="text" placeholder='Enter a phrase' onChange={handlePhraseChange}/>

        <button className='translate-button' onClick={getGiphy}>
          Translate
        </button>
        
        <div>

          <label className='weirdness-label'>Weirdness: </label>
          <select
            className='weirdness-button'
            onChange={handleWeirdness}
            value={weirdness}
          >
            <option value='0'>0</option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
        </select>

      </div>


      {giphy && giphy.images && giphy.images.downsized && (
      <div>
        <img src={giphy.images.downsized.url} alt="Giphy" height='300px'/>
        <h4>{giphy.title}</h4>
      </div>
      )}

    </div>
  )
}

export default GiphyTranslate

