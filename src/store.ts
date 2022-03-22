import { useEffect, useState } from 'react'
import { DemodalArgs } from './types'

export type DemodalAction =
  | {
      type: 'demodal/open'
      payload: { id: string; args?: DemodalArgs }
    }
  | { type: 'demodal/close'; payload: { id: string } }
  | { type: 'demodal/remove'; payload: { id: string } }

export function showModal(id: string, args?: DemodalArgs) {
  dispatch({
    type: 'demodal/open',
    payload: {
      id,
      args,
    },
  })
}

export function hideModal(id: string) {
  dispatch({
    type: 'demodal/close',
    payload: {
      id,
    },
  })
}

export function removeModal(id: string) {
  dispatch({
    type: 'demodal/remove',
    payload: {
      id,
    },
  })
}

interface DemodalStore {
  [id: string]: {
    id: string
    args?: DemodalArgs
    isOpen?: boolean
  }
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

const listeners: Array<(state: DemodalStore) => void> = []

let memoryState: DemodalStore = {}

export const dispatch = (action: DemodalAction) => {
  memoryState = reducer(memoryState, action)
  listeners.forEach(listener => {
    listener(memoryState)
  })
}

export const useStore = (): DemodalStore => {
  const [state, setState] = useState<DemodalStore>(memoryState)
  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])
  return state
}
