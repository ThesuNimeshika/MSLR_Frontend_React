import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './Pages/LandingPage/LandingPage.tsx';
import RecruiterGuide from './Pages/Recruiter/RecruiterGuide.tsx';
import DiscoverMeGuide from './Pages/Discover/DiscoverMeGuide.tsx';
import OverseasRegistration from './Pages/Discover/OverseasRegistration.tsx';
import SeekerLogin from './Pages/Auth/SeekerLogin.tsx';
import MSLHome from './Pages/MSL Admin/MSLHome.tsx';
import MSLSeeker from './Pages/MSL Admin/MSLSeeker.tsx';
import MSLClient from './Pages/MSL Admin/MSLClient.tsx';
import MSLPosted from './Pages/MSL Admin/MSLPosted.tsx';
import MSLInvoice from './Pages/MSL Admin/MSLInvoice.tsx';
import MSLScheduled from './Pages/MSL Admin/MSLScheduled.tsx';
import SeekerHome from './Pages/MSL Seeker/SeekerHome.tsx';
import SeekerDocument from './Pages/MSL Seeker/SeekerDocument.tsx';
import SeekerProfile from './Pages/MSL Seeker/SeekerProfile.tsx';
import SeekerMyApplication from './Pages/MSL Seeker/SeekerMyApplication.tsx';
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
          <Route path="/msl-home" element={<MSLHome />} />
          <Route path="/msl-seeker" element={<MSLSeeker />} />
          <Route path="/msl-client" element={<MSLClient />} />
          <Route path="/msl-posted" element={<MSLPosted />} />
          <Route path="/msl-invoice" element={<MSLInvoice />} />
          <Route path="/msl-schedule" element={<MSLScheduled />} />
          <Route path="/seeker-home" element={<SeekerHome />} />
          <Route path="/seeker-documents" element={<SeekerDocument />} />
          <Route path="/seeker-applications" element={<SeekerMyApplication />} />
          <Route path="/seeker-profile" element={<SeekerProfile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App
