import type { UnmodalHandler } from '../types'

export const muiDialog = (
  modal: UnmodalHandler
): {
  open: boolean
  onClose: () => void
  TransitionProps: { onExited: () => void }
} => {
  return {
    open: modal.isOpen,
    onClose: () => modal.close(),
    TransitionProps: {
      onExited: () => {
        modal.resolve(null)
        modal.remove()
      },
    },
  }
}
