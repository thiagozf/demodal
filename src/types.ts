/**
 * Object passed to modal component as props
 */
export interface DemodalArgs extends Record<string, unknown> {}

/**
 * The params of useModal hook.
 */
export type UseModalParams =
  | []
  | [id: string]
  | [Comp: React.ElementType, args?: DemodalArgs]

/**
 * Modal handler returned by {@link useModal | useModal} hook.
 */
export interface DemodalHandler {
  /**
   * Modal ID.
   */
  id: string

  /**
   * Open state of the modal, controlled by {@link DemodalHandler.open | open} and {@link DemodalHandler.close | close} methods.
   */
  isOpen: boolean

  /**
   * Modal component props passed through {@link DemodalHandler.open | open}.
   */
  args?: DemodalArgs

  /**
   * Opens the modal, changing {@link DemodalHandler.isOpen | isOpen} state to true.
   * @param args - an object passed to modal component as props.
   */
  open: <T>(args?: DemodalArgs) => Promise<T>

  /**
   * Closes the modal, changing {@link DemodalHandler.isOpen | isOpen} state to false.
   */
  close: () => void

  /**
   * Resolve the promise returned by {@link DemodalHandler.open | open} method.
   */
  resolve: (args?: unknown) => void

  /**
   * Remove the modal component from React component tree.
   */
  remove: () => void
}

export interface DemodalHocProps extends Record<string, unknown> {
  id: string
}
