function ConceptsPage() {
  return (
    <section>
      <h1>Concepts overview</h1>
      <p style={{ maxWidth: '40rem', marginTop: '0.75rem', lineHeight: 1.6 }}>
        This page will eventually list every data structure and algorithm that
        AlgoVista supports, with a short description and a link into the
        visualizer for each one.
      </p>

      <div style={{ marginTop: '2rem' }}>
        <h2>Planned core topics</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginTop: '0.75rem', lineHeight: 1.8 }}>
          <li>Arrays and array operations</li>
          <li>Linked lists</li>
          <li>Stacks and queues</li>
          <li>Basic sorting algorithms</li>
          <li>Search and tree basics (later stages)</li>
        </ul>
      </div>
    </section>
  );
}

export default ConceptsPage;
