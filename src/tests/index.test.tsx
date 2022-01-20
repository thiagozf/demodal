import React from 'react'
import {
  render,
  screen,
  waitForElementToBeRemoved,
  act,
} from '@testing-library/react'
import { Unmodal, useModal } from '../index'
import { TestModal, HocTestModal } from './utils'

describe('Unmodal', () => {
  it('throws error without Provider', async () => {
    expect.assertions(1)
    return expect(Unmodal.open('test-modal-without-provider')).rejects.toThrow(
      '"unmodal/open" action must be used within the Unmodal.Provider'
    )
  })

  it('renders children', () => {
    render(
      <Unmodal.Provider>
        <span>learn nice modal</span>
      </Unmodal.Provider>
    )
    const childText = screen.getByText(/learn nice modal/i)
    expect(childText).toBeInTheDocument()
  })

  it('opens and closes modal by ID', async () => {
    const hocTestModalId = 'hoc-test-modal'
    Unmodal.register(hocTestModalId, HocTestModal)
    render(<Unmodal.Provider />)
    let modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).not.toBeInTheDocument()

    act(() => {
      Unmodal.open(hocTestModalId)
    })
    modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).toBeInTheDocument()

    act(() => {
      Unmodal.close(hocTestModalId)
    })
    modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.queryByText('HocTestModal'))
  })

  it('opens and closes modal by component', async () => {
    const HocTestModal = Unmodal.create(({ name = 'nate' }) => {
      const modal = useModal()
      const remove = () => modal.remove()

      return (
        <TestModal isOpen={modal.isOpen} onExited={remove} onClose={remove}>
          <label>{name}</label>
          <div>HocTestModal</div>
        </TestModal>
      )
    })
    render(<Unmodal.Provider />)
    let modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).not.toBeInTheDocument()

    act(() => {
      Unmodal.open(HocTestModal)
    })
    modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).toBeInTheDocument()

    act(() => {
      Unmodal.close(HocTestModal)
    })
    modalTextElement = screen.queryByText('HocTestModal')
    expect(modalTextElement).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.queryByText('HocTestModal'))
  })

  it(`does nothing with unregistered IDs`, () => {
    render(<Unmodal.Provider />)
    act(() => {
      Unmodal.open('abc')
      Unmodal.close('abc')
    })
  })
})
