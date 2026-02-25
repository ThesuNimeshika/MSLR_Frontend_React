import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './Pages/LandingPage/LandingPage';
import RecruiterGuide from './Pages/Recruiter/RecruiterGuide';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/recruiter-guide" element={<RecruiterGuide />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App
