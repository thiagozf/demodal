import { UnmodalArgs } from './types'

export type UnmodalAction =
  | {
      type: 'unmodal/open'
      payload: { id: string; args?: UnmodalArgs }
    }
  | { type: 'unmodal/close'; payload: { id: string } }
  | { type: 'unmodal/remove'; payload: { id: string } }

export function showModal(id: string, args?: UnmodalArgs): UnmodalAction {
  return {
    type: 'unmodal/open',
    payload: {
      id,
      args,
    },
  }
}

export function hideModal(id: string): UnmodalAction {
  return {
    type: 'unmodal/close',
    payload: {
      id,
    },
  }
}

export function removeModal(id: string): UnmodalAction {
  return {
    type: 'unmodal/remove',
    payload: {
      id,
    },
  }
}
