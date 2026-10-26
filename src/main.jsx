import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

// Offline shell: only register in production builds. In development, tear down
// any previously installed worker and its caches — a stale cache serving old
// Vite chunks (react/react-dom mismatch) breaks React at runtime.
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    })
  } else {
    navigator.serviceWorker.getRegistrations().then((regs) =>
      regs.forEach((reg) => reg.unregister())
    ).catch(() => {})
    if (window.caches) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k))).catch(() => {})
    }
  }
}
