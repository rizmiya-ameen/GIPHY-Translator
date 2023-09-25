import React from 'react'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Container, Typography } from '@mui/material';

const WeirdnessSlider = ({weirdness, setWeirdness}) => {


  const handleSliderChange = (event) => {
    const newValue = parseInt(event.target.value);
    setWeirdness(newValue);
  };

  return (
    <Container sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>


      <Box sx={{ width: '50%', }}>
        <Slider
          aria-label="Weirdness Level"
          defaultValue={1}
          value={weirdness}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={10}
          onChange={handleSliderChange}
        />

        <Typography sx={{fontSize: '20px'}}>Weirdness Level: {weirdness}</Typography>

      </Box>

    </Container>
  )
}

export default WeirdnessSlider