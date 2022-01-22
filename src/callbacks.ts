export interface DemodalCallbacks {
  [id: string]: {
    resolve: (args: any) => void
    promise: Promise<any>
  }
}

export const callbacks: DemodalCallbacks = {}
