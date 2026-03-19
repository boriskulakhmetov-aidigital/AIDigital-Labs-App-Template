import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider, SignIn, UserButton, useAuth } from '@clerk/react'
import { applyTheme, resolveTheme } from '@boriskulakhmetov-aidigital/design-system'
import '@boriskulakhmetov-aidigital/design-system/style.css'
import App from './App'
import './index.css'

applyTheme(resolveTheme())

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

// Help page route (no auth required)
if (window.location.pathname === '/help') {
  import('./pages/HelpPage').then(({ default: Help }) => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode><Help /></React.StrictMode>
    )
  })
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={clerkKey}>
        <App auth={{ SignIn, UserButton, useAuth }} />
      </ClerkProvider>
    </React.StrictMode>
  )
}
