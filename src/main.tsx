import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TextScaleProvider } from './context/TextScaleContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TextScaleProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TextScaleProvider>
  </StrictMode>,
)
