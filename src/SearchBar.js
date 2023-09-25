import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Container, Typography } from '@mui/material';


const SearchBar = ({setPhrase, setWeirdness}) => {

  const [word, setWord] = useState("")

  const handleText = () => {
    setPhrase(word);
    setWord("") 
    setWeirdness(1)
  }
  
  return (

    <Container sx={{ position: 'relative', }}>

      <div
        style={{
        position: 'absolute',
        width: '20%',
        height: '50%',
        top: '0',
        right: '400px',
        backgroundColor: '#7aebfb',
        filter: 'blur(80px)',
        zIndex: -1, 
        }}
      ></div>
      <Typography sx={{fontSize: '40px', marginBottom: '50px', marginTop: '80px',}}>GIPHY Translator</Typography>
      
      <Box 
        sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '50px'}}
      >
        <TextField  
          id="outlined-basic" 
          label="Enter a Word / Phrase" 
          variant="outlined" 
          value={word}
          onChange={(event) => setWord(event.currentTarget.value)} 
          style={{flex: '0.3'}} 
        />
          <Button 
            variant="contained" 
            onClick={handleText} 
            style={{height: '58px', marginLeft: '10px', fontSize: '18px'}}
          >
            Translate
          </Button>
        </Box>
      
    </Container>
  )
}

export default SearchBar
