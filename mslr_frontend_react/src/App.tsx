import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './Pages/LandingPage/LandingPage.tsx';
import RecruiterGuide from './Pages/Recruiter/RecruiterGuide.tsx';
import DiscoverMeGuide from './Pages/Discover/DiscoverMeGuide.tsx';
import OverseasRegistration from './Pages/Discover/OverseasRegistration.tsx';
import SeekerLogin from './Pages/Auth/SeekerLogin.tsx';
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
          <Route path="/discover-me" element={<DiscoverMeGuide />} />
          <Route path="/overseas-registration" element={<OverseasRegistration />} />
          <Route path="/login" element={<SeekerLogin />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App
