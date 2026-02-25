import { Toaster } from 'react-hot-toast'
import LandingPage from './Pages/LandingPage/LandingPage'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <LandingPage />
    </ThemeProvider>
  )
}

export default App
