import React from 'react'
import {
  render,
  screen,
  waitForElementToBeRemoved,
  act,
} from '@testing-library/react'
import { Demodal, useModal } from '../index'
import { TestModal, HocTestModal } from './utils'

describe('Demodal', () => {
  it('throws error without Provider', async () => {
    expect.assertions(1)
    return expect(Demodal.open('test-modal-without-provider')).rejects.toThrow(
      '"demodal/open" action must be used within the Demodal.Provider'
    )
  })

  it('renders children', () => {
    render(
      <Demodal.Provider>
        <span>learn nice modal</span>
      </Demodal.Provider>
    )
    const childText = screen.getByText(/learn nice modal/i)
    expect(childText).toBeInTheDocument()
  })

  it('opens and closes modal by ID', async () => {
    const hocTestModalId = 'hoc-test-modal'
    Demodal.register(hocTestModalId, HocTestModal)
    render(<Demodal.Provider />)
    let modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).not.toBeInTheDocument()

    act(() => {
      Demodal.open(hocTestModalId)
    })
    modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).toBeInTheDocument()

    act(() => {
      Demodal.close(hocTestModalId)
    })
    modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.queryByText('HocTestModal'))
  })

  it('opens and closes modal by component', async () => {
    const HocTestModal = Demodal.create(({ name = 'nate' }) => {
      const modal = useModal()
      const remove = () => modal.remove()

      return (
        <TestModal isOpen={modal.isOpen} onExited={remove} onClose={remove}>
          <label>{name}</label>
          <div>HocTestModal</div>
        </TestModal>
      )
    })
    render(<Demodal.Provider />)
    let modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).not.toBeInTheDocument()

    act(() => {
      Demodal.open(HocTestModal)
    })
    modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).toBeInTheDocument()

    act(() => {
      Demodal.close(HocTestModal)
    })
    modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.queryByText('HocTestModal'))
  })

  it(`does nothing with unregistered IDs`, () => {
    render(<Demodal.Provider />)
    act(() => {
      Demodal.open('abc')
      Demodal.close('abc')
    })
  })
})
