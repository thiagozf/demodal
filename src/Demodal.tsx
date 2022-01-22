import React, { useEffect, useMemo, useContext, useReducer } from 'react'
import { DemodalAction, hideModal, removeModal, showModal } from './actions'
import { callbacks } from './callbacks'
import { components } from './components'
import { getModalId } from './id'
import {
  DemodalArgs,
  DemodalHandler,
  DemodalHocProps,
  UseModalParams,
} from './types'

interface DemodalStore {
  [id: string]: {
    id: string
    args?: DemodalArgs
    isOpen?: boolean
  }
}

const initialState: DemodalStore = {}
const DemodalContext = React.createContext<DemodalStore>(initialState)
const DemodalIdContext = React.createContext<string>('')

let dispatch: React.Dispatch<DemodalAction> = (action: DemodalAction) => {
  throw new Error(
    `"${action.type}" action must be used within the Demodal.Provider`
  )
}

function reducer(state: DemodalStore, action: DemodalAction): DemodalStore {
  switch (action.type) {
    case 'demodal/open': {
      const { id, args } = action.payload
      const currentState = state[id]!
      return {
        ...state,
        [id]: {
          ...currentState,
          args,
          isOpen: true,
        },
      }
    }
    case 'demodal/close': {
      const { id } = action.payload
      const currentState = state[id]!
      return {
        ...state,
        [id]: {
          ...currentState,
          isOpen: false,
        },
      }
    }
    case 'demodal/remove': {
      const { id } = action.payload
      const newState = { ...state }
      delete newState[id]
      return newState
    }
    /* istanbul ignore next */
    default:
      throw new Error(`Unhandled action: ${action}`)
  }
}

async function open<T>(
  modal: string | React.ElementType,
  args?: DemodalArgs
): Promise<T> {
  const id = getModalId(modal)
  if (typeof modal !== 'string') {
    register(id, modal)
  }

  dispatch(showModal(id, args))

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
  dispatch(hideModal(id))
}

function remove(id: string): void {
  dispatch(removeModal(id))
  delete callbacks[id]
}

export const useModal = (...params: UseModalParams): DemodalHandler => {
  const modal = params[0]
  const args = params[1]
  const modals = useContext(DemodalContext)
  const contextModalId = useContext(DemodalIdContext)
  const id: string = modal ? getModalId(modal) : contextModalId

  if (!id) {
    throw new Error('useModal is missing the modal ID.')
  }

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

function create<P>(Comp: React.ElementType) {
  return ({ id, ...props }: P & DemodalHocProps) => {
    const { args } = useModal(id)
    const modals = useContext(DemodalContext)
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

function DemodalContainer() {
  const modals = useContext(DemodalContext)
  const renderedModals = Object.keys(modals)
    .filter(id => !!modals[id] && components[id])
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

function Provider({
  children,
}: {
  children?: React.ReactNode
  dispatch?: React.Dispatch<DemodalAction>
  modals?: DemodalStore
}) {
  const [state, dispatcher] = useReducer(reducer, initialState)
  dispatch = dispatcher
  return (
    <DemodalContext.Provider value={state}>
      {children}
      <DemodalContainer />
    </DemodalContext.Provider>
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
  Provider,
  Register,
  create,
  open,
  close,
  register,
  unregister,
}
