import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './ui/styles/global.css'
import './ui/styles/game.css'
import App from './ui/App.tsx'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element in index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
