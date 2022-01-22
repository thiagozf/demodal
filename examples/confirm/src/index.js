import React from 'react'
import ReactDOM from 'react-dom'
import { Demodal } from 'demodal'
import { Page } from './page'

function App() {
  return (
    <Demodal.Provider>
      <Page />
    </Demodal.Provider>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
