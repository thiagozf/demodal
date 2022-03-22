import React from 'react'
import ReactDOM from 'react-dom'
import { Demodal } from 'demodal'
import { Page } from './page'

function App() {
  return (
    <div>
      <Page />
      <Demodal.Container />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
