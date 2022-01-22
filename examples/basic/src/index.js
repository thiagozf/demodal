import React from 'react'
import ReactDOM from 'react-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { Demodal, useModal } from 'demodal'
import { muiDialog } from 'demodal/material-ui'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const MyMuiModal = Demodal.create(({ name }) => {
  const modal = useModal()

  const resolve = value => () => {
    modal.resolve(value)
    modal.close()
  }

  return (
    <Dialog TransitionComponent={Transition} {...muiDialog(modal)}>
      <DialogTitle id="alert-dialog-slide-title">Hello, {name}!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Let Demodal help you with the heavy lifting{' '}
          <span role="img" aria-label="">
            😎
          </span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={resolve(false)} color="primary">
          Disagree
        </Button>
        <Button onClick={resolve(true)} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
})

const Page = () => {
  const handleClick = async () => {
    const result = await Demodal.open(MyMuiModal, { name: 'World' })
    console.log(result)
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Button variant="contained" onClick={handleClick} color="primary">
        Open Modal
      </Button>
    </Box>
  )
}

function App() {
  return (
    <Demodal.Provider>
      <Page />
    </Demodal.Provider>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
