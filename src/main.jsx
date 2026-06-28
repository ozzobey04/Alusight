import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import MobileApp from './MobileApp.jsx'
import './index.css'

const isNative = typeof window !== 'undefined' && !!window?.Capacitor?.isNativePlatform?.()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {isNative ? <MobileApp /> : <App />}
    </BrowserRouter>
  </React.StrictMode>,
)
