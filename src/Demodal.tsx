import React, { useEffect, useMemo, useContext } from 'react'
import { hideModal, removeModal, showModal, useStore } from './store'
import { callbacks } from './callbacks'
import { components } from './components'
import { getModalId } from './id'
import {
  DemodalArgs,
  DemodalComponent,
  DemodalContainer,
  DemodalHandler,
  UseModalParams,
} from './types'

const DemodalIdContext = React.createContext<string>('')

async function open<T>(
  modal: string | React.ElementType,
  args?: DemodalArgs
): Promise<T> {
  const id = getModalId(modal)
  if (typeof modal !== 'string') {
    register(id, modal)
  }

  showModal(id, args)

  if (!callbacks[id]) {
    let resolve!: (value: T) => void
    const promise = new Promise(r => {
      resolve = r
    })
    callbacks[id] = { resolve, promise }
  }
  return callbacks[id]!.promise
}

function close(modal: string | React.ElementType) {
  const id = getModalId(modal)
  hideModal(id)
}

function remove(id: string): void {
  removeModal(id)
  delete callbacks[id]
}

export const useModal = (...params: UseModalParams): DemodalHandler => {
  const modal = params[0]
  const args = params[1]
  const modals = useStore()
  const contextModalId = useContext(DemodalIdContext)
  const id: string = modal ? getModalId(modal) : contextModalId

  useEffect(() => {
    if (modal && typeof modal !== 'string') {
      register(id, modal)
    }
  }, [id, modal, args])

  const modalInfo = modals[id]

  return useMemo<DemodalHandler>(
    () => ({
      id,
      args: modalInfo?.args,
      isOpen: !!modalInfo?.isOpen,
      open: (args?: DemodalArgs) => open(id, args),
      close: () => close(id),
      remove: () => remove(id),
      resolve: (args?: unknown) => {
        callbacks[id]?.resolve(args)
        delete callbacks[id]
      },
    }),
    [id, modalInfo]
  )
}

function create<P>(
  Comp: DemodalComponent<P>
): DemodalComponent<DemodalArgs<P>> {
  return ({ id, ...props }) => {
    const { args } = useModal(id)
    const modals = useStore()
    const modal = modals[id]

    if (!modal) {
      return null
    }

    return (
      <DemodalIdContext.Provider value={id}>
        <Comp {...(props as P)} {...args} />
      </DemodalIdContext.Provider>
    )
  }
}

function register(id: string, comp: React.ElementType): void {
  if (!components[id]) {
    components[id] = comp
  }
}

function unregister(id: string): void {
  delete components[id]
}

function Container({ containerId }: DemodalContainer) {
  const modals = useStore()
  const renderedModals = Object.keys(modals)
    .filter(
      id => modals[id]?.args?.containerId === containerId && components[id]
    )
    .map(id => {
      return {
        id,
        args: modals[id]?.args || {},
        Component: components[id]!,
      }
    })
  return (
    <>
      {renderedModals.map(({ id, Component, args }) => (
        <Component key={id} id={id} {...args} />
      ))}
    </>
  )
}

function Register({
  id,
  component,
}: {
  id: string
  component: React.ElementType
}) {
  useEffect(() => {
    register(id, component)
    return () => {
      unregister(id)
    }
  }, [id, component])
  return null
}

export const Demodal = {
  Container,
  Register,
  create,
  open,
  close,
  register,
  unregister,
}
