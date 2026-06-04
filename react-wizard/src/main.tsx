import React from 'react'
import ReactDOM from 'react-dom/client'
import { Wizard } from './components/Wizard'
import './index.css'

ReactDOM.createRoot(document.getElementById('react-wizard-root')!).render(
  <React.StrictMode>
    <Wizard />
  </React.StrictMode>,
)
