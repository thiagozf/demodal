import React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { Unmodal, useModal } from 'react-unmodal'
import { muiDialog } from 'react-unmodal/material-ui'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

// Register the Confirm modal wrapping it with Unmodal.create
// Props come from modal.open()
const Confirm = Unmodal.create(
  ({
    title = 'Confirmation',
    message = 'Do you confirm this action?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
  }) => {
    // useModal hook to control UI components
    const modal = useModal()

    // Once resolved, automatically close the modal
    const resolve = value => () => {
      modal.resolve(value)
      modal.close()
    }

    // "muiDialog" helper function binds react-unmodal with Material UI's Dialog component
    return (
      <Dialog TransitionComponent={Transition} {...muiDialog(modal)}>
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={resolve(false)}>{cancelLabel}</Button>
          <Button onClick={resolve(true)} color="primary" autoFocus>
            {confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
)

// Exports just a function that returns a promise with the result
export const confirm = props => Unmodal.open(Confirm, props)
