/* istanbul ignore file */
import React, { ErrorInfo, useEffect, useRef } from 'react'
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  act,
} from '@testing-library/react'
import { Unmodal, useModal } from '../index'
import { UnmodalHandler } from '../types'

export const delay = (t: number) =>
  new Promise(resolve => setTimeout(resolve, t))

export const testHelper = async (
  Modal: React.ComponentType<any>,
  helper: (modal: UnmodalHandler) => Object,
  text: string
) => {
  const HocModal = Unmodal.create(({ name }: { name: string }) => {
    const modal = useModal()
    return (
      <Modal {...helper(modal)}>
        <label>{name}</label>
      </Modal>
    )
  })

  render(
    <Unmodal.Provider>
      <HocModal id="helper-modal" name={text} />
    </Unmodal.Provider>
  )

  let modalTextElement = screen.queryByText(text)
  expect(modalTextElement).not.toBeInTheDocument()

  act(() => {
    Unmodal.open('helper-modal', { name: text })
  })

  modalTextElement = screen.queryByText(text)
  expect(modalTextElement).toBeInTheDocument()

  act(() => {
    fireEvent.click(screen.getByText('Close'))
  })
  modalTextElement = screen.queryByText(text)
  expect(modalTextElement).toBeInTheDocument()

  await waitForElementToBeRemoved(() => screen.queryByText(text))
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  info?: ErrorInfo
}
export class ErrorBoundary<P = {}> extends React.Component<
  P,
  ErrorBoundaryState
> {
  constructor(props: P) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ hasError: true, error, info })
  }

  renderDefaultError() {
    return <div>Something went wrong.</div>
  }

  render() {
    if (this.state.hasError) {
      return <div>{this.renderDefaultError()}</div>
    }
    return this.props.children
  }
}

export interface TestModalProps {
  open?: boolean
  isOpen?: boolean
  onClose?: () => void
  onExited?: () => void
  onCancel?: () => void
  children?: React.ReactNode
}

export const TestModal = ({
  isOpen = false,
  onExited = () => void 0,
  onClose = () => void 0,
  onCancel = () => void 0,
  children,
}: TestModalProps) => {
  const lastVisibleRef = useRef(isOpen)
  const lastVisible = lastVisibleRef.current
  useEffect(() => {
    if (!isOpen && lastVisible) {
      setTimeout(onExited, 30)
    }
  }, [isOpen, onExited, lastVisible])

  lastVisibleRef.current = isOpen
  return (
    <div>
      TestModal {isOpen} <div>{children}</div>
      <p>
        <button onClick={onClose}>Close</button>
      </p>
      <p>
        <button onClick={onCancel}>Cancel</button>
      </p>
    </div>
  )
}

export const HocTestModal = Unmodal.create(
  ({ name = 'nate' }: { name: string }) => {
    const modal = useModal()
    const remove = () => modal.remove()

    return (
      <TestModal isOpen={modal.isOpen} onExited={remove} onClose={remove}>
        <label>{name}</label>
        <div>HocTestModal</div>
        <div>{modal.id}</div>
      </TestModal>
    )
  }
)
