import React, { useState } from 'react'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { confirm } from './confirm'

export const Page = () => {
  const [result, setResult] = useState(null)

  const handleClick = async () => {
    const result = await confirm({
      title: 'Are you sure?',
      body: 'It is impossible to revert this action',
    })
    console.log(result)
    setResult(result)
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Badge badgeContent={''} color={result ? 'success' : 'error'}>
        <Button variant="contained" onClick={handleClick} color="primary">
          Alert
        </Button>
      </Badge>
    </Box>
  )
}
