function MainLayout({ children }) {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="logo">AlgoVista</div>
        <nav className="nav-links">
          <a href="#concepts">Concepts</a>
          <a href="#simulator">Simulator</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main className="app-main">
        {children}
      </main>

      <footer className="app-footer">
        © {new Date().getFullYear()} AlgoVista
      </footer>
    </div>
  );
}

export default MainLayout;
