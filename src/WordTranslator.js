import React, { useEffect, useState } from 'react'
import { getGiphy } from './utils'
import SearchBar from './SearchBar'

const WordTranslator = () => {

  const [giphy, setGiphy] = useState({})

  useEffect(() => {
    const fetchGiphy = async () => {
      try {
        const response = await getGiphy()
        setGiphy(response)
      } catch (error) {
        console.error("Error fetching data", error);
        throw error;
      }
    }

    fetchGiphy()
  }, [])

  console.log(giphy)

  return (

    <div>

      <h1>Word/Phrase Translator</h1>

      <SearchBar />

      {giphy && giphy.images && giphy.images.downsized && (

        <div>
          <img 
            src={giphy.images.downsized.url}  
            alt={giphy.title} 
            height="300px"
          />

          <p>{giphy.title}</p>

        </div>

      )}
      
    </div>
  )
}

export default WordTranslator