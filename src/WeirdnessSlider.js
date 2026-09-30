import React, { useEffect, useState } from 'react'
import { Box, Slider, Stack, Typography } from '@mui/material'

const LEVELS = [
  { max: 2, label: 'Literal' },
  { max: 4, label: 'A little odd' },
  { max: 6, label: 'Quirky' },
  { max: 8, label: 'Bizarre' },
  { max: 10, label: 'Off the charts' },
]

const describe = (value) => LEVELS.find((level) => value <= level.max).label

const WeirdnessSlider = ({ weirdness, onChange, disabled }) => {
  // Track the thumb locally so dragging is smooth; only commit (and fetch) on release
  const [value, setValue] = useState(weirdness)

  useEffect(() => setValue(weirdness), [weirdness])

  return (
    <Box sx={{ width: '100%', maxWidth: 480, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography id="weirdness-label" variant="subtitle2">
          Weirdness
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {value}/10 · {describe(value)}
        </Typography>
      </Stack>
      <Slider
        aria-labelledby="weirdness-label"
        value={value}
        step={1}
        marks
        min={0}
        max={10}
        disabled={disabled}
        onChange={(_, newValue) => setValue(newValue)}
        onChangeCommitted={(_, newValue) => onChange(newValue)}
        color="secondary"
      />
    </Box>
  )
}

export default WeirdnessSlider
