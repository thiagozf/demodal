import React, { useEffect, useMemo, useContext, useReducer } from 'react'
import { UnmodalAction, hideModal, removeModal, showModal } from './actions'
import { callbacks } from './callbacks'
import { components } from './components'
import { getModalId } from './id'
import {
  UnmodalArgs,
  UnmodalHandler,
  UnmodalHocProps,
  UseModalParams,
} from './types'

interface UnmodalStore {
  [id: string]: {
    id: string
    args?: UnmodalArgs
    isOpen?: boolean
  }
}

const initialState: UnmodalStore = {}
const UnmodalContext = React.createContext<UnmodalStore>(initialState)
const UnmodalIdContext = React.createContext<string>('')

let dispatch: React.Dispatch<UnmodalAction> = (action: UnmodalAction) => {
  throw new Error(
    `"${action.type}" action must be used within the Unmodal.Provider`
  )
}

function reducer(state: UnmodalStore, action: UnmodalAction): UnmodalStore {
  switch (action.type) {
    case 'unmodal/open': {
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
    case 'unmodal/close': {
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
    case 'unmodal/remove': {
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
  args?: UnmodalArgs
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

export const useModal = (...params: UseModalParams): UnmodalHandler => {
  const modal = params[0]
  const args = params[1]
  const modals = useContext(UnmodalContext)
  const contextModalId = useContext(UnmodalIdContext)
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

  return useMemo<UnmodalHandler>(
    () => ({
      id,
      args: modalInfo?.args,
      isOpen: !!modalInfo?.isOpen,
      open: (args?: UnmodalArgs) => open(id, args),
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
  return ({ id, ...props }: P & UnmodalHocProps) => {
    const { args } = useModal(id)
    const modals = useContext(UnmodalContext)
    const modal = modals[id]

    if (!modal) {
      return null
    }

    return (
      <UnmodalIdContext.Provider value={id}>
        <Comp {...(props as P)} {...args} />
      </UnmodalIdContext.Provider>
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

function UnmodalContainer() {
  const modals = useContext(UnmodalContext)
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
  dispatch?: React.Dispatch<UnmodalAction>
  modals?: UnmodalStore
}) {
  const [state, dispatcher] = useReducer(reducer, initialState)
  dispatch = dispatcher
  return (
    <UnmodalContext.Provider value={state}>
      {children}
      <UnmodalContainer />
    </UnmodalContext.Provider>
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

export const Unmodal = {
  Provider,
  Register,
  create,
  open,
  close,
  register,
  unregister,
}
