import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Buffer } from 'buffer'
import ErrorDisplay from './components/ErrorDisplay.jsx'
import './index.css'
import App from './App.jsx'

window.Buffer = Buffer;

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorDisplay>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorDisplay>
  </StrictMode>,
)
