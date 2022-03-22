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
  it('opens and closes modal by ID', async () => {
    const hocTestModalId = 'hoc-test-modal'
    Demodal.register(hocTestModalId, HocTestModal)
    render(<Demodal.Container />)
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
    const HocTestModal = Demodal.create(
      ({ name = 'nate' }: { name: string }) => {
        const modal = useModal()
        const remove = () => modal.remove()

        return (
          <TestModal isOpen={modal.isOpen} onExited={remove} onClose={remove}>
            <label>{name}</label>
            <div>HocTestModal</div>
          </TestModal>
        )
      }
    )
    render(<Demodal.Container />)
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
    render(<Demodal.Container />)
    act(() => {
      Demodal.open('abc')
      Demodal.close('abc')
    })
  })
})
