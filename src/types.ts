/**
 * Object passed to modal component as props
 */
export interface UnmodalArgs extends Record<string, unknown> {}

/**
 * The params of useModal hook.
 */
export type UseModalParams =
  | []
  | [id: string]
  | [Comp: React.ElementType, args?: UnmodalArgs]

/**
 * Modal handler returned by {@link useModal | useModal} hook.
 */
export interface UnmodalHandler {
  /**
   * Modal ID.
   */
  id: string

  /**
   * Open state of the modal, controlled by {@link UnmodalHandler.open | open} and {@link UnmodalHandler.close | close} methods.
   */
  isOpen: boolean

  /**
   * Modal component props passed through {@link UnmodalHandler.open | open}.
   */
  args?: UnmodalArgs

  /**
   * Opens the modal, changing {@link UnmodalHandler.isOpen | isOpen} state to true.
   * @param args - an object passed to modal component as props.
   */
  open: <T>(args?: UnmodalArgs) => Promise<T>

  /**
   * Closes the modal, changing {@link UnmodalHandler.isOpen | isOpen} state to false.
   */
  close: () => void

  /**
   * Resolve the promise returned by {@link UnmodalHandler.open | open} method.
   */
  resolve: (args?: unknown) => void

  /**
   * Remove the modal component from React component tree.
   */
  remove: () => void
}

export interface UnmodalHocProps extends Record<string, unknown> {
  id: string
}
