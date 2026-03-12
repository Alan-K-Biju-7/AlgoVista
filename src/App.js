import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import ConceptsPage from './pages/ConceptsPage';
import './styles/global.css';

function App() {
  return (
    <MainLayout>
      {/* swap between these manually for now while building */}
      <HomePage />
      {/* <ConceptsPage /> */}
    </MainLayout>
  );
}

export default App;
