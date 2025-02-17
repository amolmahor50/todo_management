import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { TodoContextProvider } from './components/context/TodoContext.jsx'
import { Toaster } from "sonner"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoContextProvider>
      <div className="bg-muted px-4 py-3">
        <App />
      </div>
    </TodoContextProvider>
    <Toaster />
  </StrictMode>,
)
