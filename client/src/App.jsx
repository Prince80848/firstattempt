import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import TestSeriesPage from './pages/TestSeriesPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CAFoundation from './pages/CAFoundation';
import CAInter from './pages/CAInter';
import CAFinal from './pages/CAFinal';
import ForgotPassword from './pages/ForgotPassword';

// Exam Pages
import MentorPanel from './pages/MentorPanel';
import ExamPortal from './pages/ExamPortal';
import ExamInstructions from './pages/ExamInstructions';
import TakeTest from './pages/TakeTest';
import TestResult from './pages/TestResult';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/style.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Pages with Navbar and Footer */}
            <Route path="/" element={<><Navbar /><main><Home /></main><Footer /></>} />
            <Route path="/about" element={<><Navbar /><main><About /></main><Footer /></>} />
            <Route path="/login" element={<><Navbar /><main><Login /></main><Footer /></>} />
            <Route path="/signup" element={<><Navbar /><main><Signup /></main><Footer /></>} />
            <Route path="/forgot-password" element={<><Navbar /><main><ForgotPassword /></main><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><main><Contact /></main><Footer /></>} />
            <Route path="/test-series" element={<><Navbar /><main><TestSeriesPage /></main><Footer /></>} />
            <Route path="/ca-foundation" element={<><Navbar /><main><CAFoundation /></main><Footer /></>} />
            <Route path="/ca-inter" element={<><Navbar /><main><CAInter /></main><Footer /></>} />
            <Route path="/ca-final" element={<><Navbar /><main><CAFinal /></main><Footer /></>} />
            <Route path="/profile" element={<><Navbar /><main><ProtectedRoute><Profile /></ProtectedRoute></main><Footer /></>} />
            <Route path="/dashboard" element={<><Navbar /><main><ProtectedRoute adminOnly><Dashboard /></ProtectedRoute></main><Footer /></>} />

            {/* Mentor Panel */}
            <Route path="/mentor" element={<><Navbar /><main><ProtectedRoute><MentorPanel /></ProtectedRoute></main><Footer /></>} />

            {/* Exam Portal with Navbar */}
            <Route path="/exam/portal/:testSeriesId" element={<><Navbar /><main><ProtectedRoute><ExamPortal /></ProtectedRoute></main><Footer /></>} />

            {/* Full screen exam pages - NO Navbar/Footer */}
            <Route path="/exam/instructions/:testId" element={<ProtectedRoute><ExamInstructions /></ProtectedRoute>} />
            <Route path="/exam/take/:testId" element={<ProtectedRoute><TakeTest /></ProtectedRoute>} />
            <Route path="/exam/result/:attemptId" element={<><Navbar /><main><ProtectedRoute><TestResult /></ProtectedRoute></main><Footer /></>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
