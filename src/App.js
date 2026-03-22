import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import ConceptsPage from './pages/ConceptsPage';
import SimulatorPage from './pages/SimulatorPage';
import AboutPage from './pages/AboutPage';
import './styles/global.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/concepts"  element={<ConceptsPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/about"     element={<AboutPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
