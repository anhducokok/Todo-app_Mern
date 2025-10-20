import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from 'next-themes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <AuthProvider>
      <App />
    </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
