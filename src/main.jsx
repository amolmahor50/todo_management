import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { TodoContextProvider } from './components/context/TodoContext.jsx'
import { Toaster } from "sonner"
import App from './App.jsx'
import { ThemeProvider } from "@/components/theme-provider"
import { FontSizeProvider } from './components/context/FontSizeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoContextProvider>
      <ThemeProvider defaultTheme="system" storageKey="todo-theme">
        <FontSizeProvider>
          <div className="bg-muted min-h-screen px-4 py-3">
            <App />
          </div>
        </FontSizeProvider>
      </ThemeProvider>
    </TodoContextProvider>
    <Toaster />
  </StrictMode>,
)
