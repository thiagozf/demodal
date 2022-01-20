const idProp = 'UnmodalId'

let id = 0

const generate = () => `__unmodal_${id++}`

export const getModalId = (modal: any): string => {
  if (typeof modal === 'string') {
    return modal as string
  }
  if (!modal[idProp]) {
    modal[idProp] = generate()
  }
  return modal[idProp]!
}
