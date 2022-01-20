export interface UnmodalCallbacks {
  [id: string]: {
    resolve: (args: any) => void
    promise: Promise<any>
  }
}

export const callbacks: UnmodalCallbacks = {}
