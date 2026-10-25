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

// The built game installs as an app and works offline (see vite.pwa.ts). Some hosts, such as
// a preview frame, do not allow a service worker; the game then just runs online.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {})
}
