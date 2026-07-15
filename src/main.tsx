import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TextScaleProvider } from './context/TextScaleContext.tsx'
import { OnboardingMediaProvider } from './context/OnboardingMediaContext.tsx'
import { SessionProvider } from './context/SessionContext.tsx'
import { MembersProvider } from './context/MembersContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TextScaleProvider>
      <SessionProvider>
        <MembersProvider>
          <OnboardingMediaProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </OnboardingMediaProvider>
        </MembersProvider>
      </SessionProvider>
    </TextScaleProvider>
  </StrictMode>,
)
