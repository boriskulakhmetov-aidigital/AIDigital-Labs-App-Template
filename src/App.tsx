import { SignIn, UserButton, useAuth } from '@clerk/react'
import { AppShell, ChatPanel, type ChatMessage } from '@boriskulakhmetov-aidigital/design-system'
import { useState } from 'react'
import './App.css'

// TODO: Replace with your app's sidebar component
function PlaceholderSidebar() {
  return (
    <aside style={{ width: 260, borderRight: '1px solid var(--border)', padding: 16 }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
        Replace this with your Sidebar component
      </p>
    </aside>
  )
}

export default function App() {
  return (
    <AppShell
      appTitle="Your App Name"        // TODO: Change this
      activityLabel="Session"          // TODO: "Audit" | "Session" | "Scan"
      detailEndpoint="get-session"     // TODO: Match your Netlify function name
      auth={{ SignIn, UserButton, useAuth }}
      sidebar={<PlaceholderSidebar />}
    >
      {({ authFetch }) => <MainContent authFetch={authFetch} />}
    </AppShell>
  )
}

function MainContent({ authFetch: _authFetch }: { authFetch: (url: string, opts?: RequestInit) => Promise<Response> }) {
  // TODO: Use _authFetch for API calls, rename back to authFetch when ready
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streaming, setStreaming] = useState(false)

  async function handleSend(text: string, _asset: unknown) {
    // TODO: Wire up your orchestrator
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setStreaming(true)

    // Example: call your orchestrator function
    // const res = await authFetch('/.netlify/functions/orchestrator', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: text }),
    // })

    // Placeholder response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a placeholder response. Wire up your orchestrator!',
      }])
      setStreaming(false)
    }, 1000)
  }

  return (
    <ChatPanel
      messages={messages}
      streaming={streaming}
      error={null}
      onSend={handleSend}
      welcomeIcon="🚀"
      welcomeTitle="Welcome to Your App"
      welcomeDescription="This is a template. Replace with your app's welcome message."
      placeholder="Type a message…"
    />
  )
}
