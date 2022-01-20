import React from 'react'
import { TestModal, testHelper } from '../../tests/utils'
import { muiDialog } from '../index'

describe('Material UI', () => {
  it('binds material-ui properties', async () => {
    const MuiDialog = ({
      open,
      onCancel,
      onClose,
      TransitionProps: { onExited },
      children,
    }: {
      open?: boolean
      onCancel?: () => void
      onClose?: () => void
      onExited: () => void
      TransitionProps: { onExited: () => void }
      children: React.ReactNode
    }) => {
      return (
        <TestModal
          onCancel={onCancel}
          isOpen={open}
          onClose={onClose}
          onExited={onExited}
        >
          {children}
        </TestModal>
      )
    }
    await testHelper(MuiDialog, muiDialog, 'MuiDialogTest')
  })
})
