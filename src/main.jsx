import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

import { registerSW } from 'virtual:pwa-register';
const updateSW = registerSW({
  onNeedRefresh() { if (window && window.dispatchEvent) { window.dispatchEvent(new CustomEvent('sw.updatefound')); } },
  onOfflineReady() { if (window && window.dispatchEvent) { window.dispatchEvent(new CustomEvent('sw.offlineReady')); } }
});
