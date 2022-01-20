import React from 'react'
import ReactDOM from 'react-dom'
import { Unmodal } from 'react-unmodal'
import { Page } from './page'

function App() {
  return (
    <Unmodal.Provider>
      <Page />
    </Unmodal.Provider>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
