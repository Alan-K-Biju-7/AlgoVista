import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ConceptsPage from './pages/ConceptsPage';
import SimulatorPage from './pages/SimulatorPage';
import AboutPage from './pages/AboutPage';
import PracticePage from './pages/PracticePage';
import DSABeginnersPage from './pages/DSABeginnersPage';
import ConceptLessonPage from './pages/ConceptLessonPage';
import CoachPage from './pages/CoachPage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/global.css';

const routerBasename = process.env.REACT_APP_ROUTER_BASENAME || '';

function App() {
  return (
    <Router basename={routerBasename}>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/"              element={<HomePage />} />
            <Route path="/dsa-beginners" element={<DSABeginnersPage />} />
            <Route path="/dsa-beginners/:conceptId" element={<ConceptLessonPage />} />
            <Route path="/coach"         element={<CoachPage />} />
            <Route path="/concepts"      element={<ConceptsPage />} />
            <Route path="/simulator"     element={<SimulatorPage />} />
            <Route path="/about"         element={<AboutPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
