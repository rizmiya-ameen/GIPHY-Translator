import './App.css';
import SearchBar from './SearchBar';
import WordTranslator from './WordTranslator';
import WeirdnessSlider from './WeirdnessSlider';
import React, { useEffect, useState } from 'react'
import { getGiphy } from './utils'


function App() {

  const [giphy, setGiphy] = useState({})
  const [phrase, setPhrase] = useState('')
  const [weirdness, setWeirdness] = useState(1)

  useEffect(() => {
    const fetchGiphy = async () => {
      try {
        const response = await getGiphy(phrase, weirdness)
        setGiphy(response);
        
      } catch (error) {
        console.error("Error fetching data", error);
        throw error;
      }
    }

    fetchGiphy()
  }, [phrase, weirdness])



  console.log(giphy.id)
  //console.log(phrase)

  return (
    <div className="App">
      <SearchBar setPhrase={setPhrase} setWeirdness={setWeirdness}/>

      {giphy.id && 
        <>
          <WordTranslator giphy={giphy}/>
          <WeirdnessSlider weirdness={weirdness} setWeirdness={setWeirdness}/>
        </>
      }
    </div>
  );
}

export default App;
