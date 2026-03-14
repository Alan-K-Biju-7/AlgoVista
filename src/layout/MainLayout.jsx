import { Link } from 'react-router-dom';

function MainLayout({ children }) {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            AlgoVista
          </Link>
        </div>
        <nav className="nav-links">
          <Link to="/concepts">Concepts</Link>
          <Link to="/simulator">Simulator</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        © {new Date().getFullYear()} AlgoVista
      </footer>
    </div>
  );
}

export default MainLayout;
