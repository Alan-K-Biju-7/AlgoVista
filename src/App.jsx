import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import AuthRequired from './components/AuthRequired';
import './styles/global.css';

const ConceptsPage = lazy(() => import('./pages/ConceptsPage'));
const SimulatorPage = lazy(() => import('./pages/SimulatorPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const DSABeginnersPage = lazy(() => import('./pages/DSABeginnersPage'));
const ConceptLessonPage = lazy(() => import('./pages/ConceptLessonPage'));
const CoachPage = lazy(() => import('./pages/CoachPage'));

const configuredBase = import.meta.env.VITE_ROUTER_BASENAME || import.meta.env.BASE_URL || '/';
const routerBasename = configuredBase === '/' ? '' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;

function App() {
  return (
    <Router basename={routerBasename}>
      <AuthProvider>
        <MainLayout>
          <Suspense
            fallback={(
              <div className="route-loading" role="status" aria-live="polite">
                <span className="route-loading__mark" aria-hidden="true">AV</span>
                <span>Preparing your learning workspace…</span>
              </div>
            )}
          >
            <Routes>
              <Route path="/"              element={<HomePage />} />
              <Route path="/dsa-beginners" element={<DSABeginnersPage />} />
              <Route path="/dsa-beginners/:conceptId" element={<ConceptLessonPage />} />
              <Route
                path="/coach"
                element={(
                  <AuthRequired
                    feature="AI coaching"
                    description="Ask for intuition, dry runs, edge cases, and interview guidance tied to your private learning profile."
                  >
                    <CoachPage />
                  </AuthRequired>
                )}
              />
              <Route path="/concepts"      element={<ConceptsPage />} />
              <Route path="/simulator"     element={<SimulatorPage />} />
              <Route path="/about"         element={<AboutPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/practice/:problemId" element={<PracticePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
