const EMBED_URL = 'https://datastudio.google.com/embed/reporting/b51abdc1-caaa-49cb-8dcb-de1d16494fcc/page/qmtAG';

export default function Dashboard() {
  return (
    <section className="dashboard-section">
      <header className="section-header">
        <h2 className="section-title"><span>📊</span> Analítica de Reservas</h2>
      </header>
      <div className="dashboard-container">
        <iframe
          src={EMBED_URL}
          title="Dashboard analítico Sabores & Rutas"
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </section>
  );
}