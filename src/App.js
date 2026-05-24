import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ConceptsPage from './pages/ConceptsPage';
import SimulatorPage from './pages/SimulatorPage';
import AboutPage from './pages/AboutPage';
import PracticePage from './pages/PracticePage';
import DSABeginnersPage from './pages/DSABeginnersPage';
import CoachPage from './pages/CoachPage';
import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/"              element={<HomePage />} />
            <Route path="/dsa-beginners" element={<DSABeginnersPage />} />
            <Route path="/coach"         element={<CoachPage />} />
            <Route path="/concepts"      element={<ConceptsPage />} />
            <Route path="/simulator"     element={<SimulatorPage />} />
            <Route path="/about"         element={<AboutPage />} />
            <Route path="/practice" element={<PracticePage />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
