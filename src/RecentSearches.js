import React from 'react'
import { Button, Chip, Stack, Typography } from '@mui/material'
import { HistoryIcon } from './icons'

const RecentSearches = ({ items, onSelect, onRemove, onClear }) => {
  if (items.length === 0) return null

  return (
    <Stack spacing={1.5} alignItems="center" component="section" aria-labelledby="recent-heading">
      <Stack direction="row" spacing={1} alignItems="center">
        <HistoryIcon fontSize="small" color="action" />
        <Typography id="recent-heading" variant="subtitle2" color="text.secondary">
          Recent searches
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="center" alignItems="center">
        {items.map((item) => (
          <Chip
            key={item}
            label={item}
            onClick={() => onSelect(item)}
            onDelete={() => onRemove(item)}
          />
        ))}
        <Button size="small" onClick={onClear}>
          Clear all
        </Button>
      </Stack>
    </Stack>
  )
}

export default RecentSearches
