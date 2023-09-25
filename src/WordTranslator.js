import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Container } from '@mui/material';

const WordTranslator = ({giphy}) => {


  return (

    <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '50px'}}>
      
      {giphy && giphy.images && giphy.images.downsized && (

        <Box>
          <Paper elevation={5} style={{height: "400px", width: '400px', }}>
          <img 
            src={giphy.images.downsized.url}  
            alt={giphy.title} 
            height="300px"
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          /></Paper>

          <p>{giphy.title}</p>

        </Box>

        

      )}
      
    </Container>
  )
}

export default WordTranslator