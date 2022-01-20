import React from 'react'
import {
  render,
  screen,
  waitForElementToBeRemoved,
  act,
} from '@testing-library/react'
import { Unmodal, useModal, UnmodalHandler } from '../index'
import { ErrorBoundary, HocTestModal } from './utils'

const testUseModal = async (
  modal: UnmodalHandler,
  props: { name?: string } = {}
) => {
  let modalTextElement = screen.queryByText('HocTestModal')
  expect(modalTextElement).not.toBeInTheDocument()

  const resolved: any[] = []

  act(() => {
    modal.open(props).then(res => resolved.push(res))
  })

  act(() => {
    modal.open(props).then((res = true) => resolved.push(res))
  })
  modalTextElement = screen.queryByText('HocTestModal')
  expect(modalTextElement).toBeInTheDocument()

  if (props.name) {
    modalTextElement = screen.queryByText(props.name)
    expect(modalTextElement).toBeInTheDocument()
  }

  act(() => {
    modal.resolve({ resolved: true })
    modal.close()
  })

  modalTextElement = screen.queryByText('HocTestModal')
  expect(modalTextElement).toBeInTheDocument()

  await waitForElementToBeRemoved(screen.queryByText('HocTestModal'))

  expect(resolved).toEqual([{ resolved: true }, { resolved: true }])
}

describe('useModal', () => {
  it('throws error without Provider', () => {
    console.error = () => null
    render(
      <ErrorBoundary>
        {/* @ts-ignore */}
        <HocTestModal />
      </ErrorBoundary>
    )
    expect(screen.queryByText('Something went wrong.')).toBeInTheDocument()
  })

  it('gets modal by ID (register)', async () => {
    const hocTestModalId = 'hoc-test-modal'
    Unmodal.register(hocTestModalId, HocTestModal)
    let modal!: UnmodalHandler
    const App = () => {
      modal = useModal(hocTestModalId)
      return <Unmodal.Provider />
    }
    render(<App />)
    await testUseModal(modal)
  })

  it('gets modal by ID (JSX)', async () => {
    let modal!: UnmodalHandler
    const App = () => {
      modal = useModal('mytestmodal')
      return (
        <Unmodal.Provider>
          <HocTestModal id="mytestmodal" name="bood" />
        </Unmodal.Provider>
      )
    }
    render(<App />)
    await testUseModal(modal)
  })

  it('gets modal by ID (Register)', async () => {
    let modal!: UnmodalHandler
    const App = () => {
      modal = useModal('mytestmodal2')
      return (
        <Unmodal.Provider>
          <Unmodal.Register id="mytestmodal2" component={HocTestModal} />
        </Unmodal.Provider>
      )
    }
    render(<App />)
    await testUseModal(modal, { name: 'bood' })
  })

  it('registers unseen components', async () => {
    let modal!: UnmodalHandler
    const App = () => {
      modal = useModal(HocTestModal, { name: 'bood' })
      return <Unmodal.Provider />
    }
    render(<App />)
    await testUseModal(modal)
  })
})
