import { DemodalArgs } from './types'

export type DemodalAction =
  | {
      type: 'demodal/open'
      payload: { id: string; args?: DemodalArgs }
    }
  | { type: 'demodal/close'; payload: { id: string } }
  | { type: 'demodal/remove'; payload: { id: string } }

export function showModal(id: string, args?: DemodalArgs): DemodalAction {
  return {
    type: 'demodal/open',
    payload: {
      id,
      args,
    },
  }
}

export function hideModal(id: string): DemodalAction {
  return {
    type: 'demodal/close',
    payload: {
      id,
    },
  }
}

export function removeModal(id: string): DemodalAction {
  return {
    type: 'demodal/remove',
    payload: {
      id,
    },
  }
}
