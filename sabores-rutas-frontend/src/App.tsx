import { useEffect, useState } from 'react';
import './App.css';
import { getCategorias, getEstablecimientos } from './services/api';
import type { Categoria, Establecimiento } from './types';
import { Navbar } from './components/Navbar';
import { PlaceCard } from './components/PlaceCard';
import { CategoryFilter } from './components/CategoryFilter';
import Dashboard from './components/Dashboard';
import HeroCarousel from './components/HeroCarousel';
import ReservasPanel from './components/ReservasPanel';

function App() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [catSeleccionada, setCatSeleccionada] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      const [dataCats, dataPlaces] = await Promise.all([
        getCategorias(),
        getEstablecimientos(),
      ]);

      setCategorias(dataCats);
      setEstablecimientos(dataPlaces);
      setLoading(false);
    };

    cargarDatos();
  }, []);

  const lugaresFiltrados = (establecimientos || []).filter((item) =>
    catSeleccionada ? item.categoria_id === catSeleccionada : true
  );

  return (
    <div>
      <Navbar />

      <HeroCarousel />

      <main className="main-container" id="lugares">
        <header className="section-header">
          <h2 className="section-title">
            <span>🏷️</span> Categorías
          </h2>
        </header>

        <CategoryFilter
          categorias={categorias}
          categoriaSeleccionada={catSeleccionada}
          onSelectCategoria={setCatSeleccionada}
        />

        <header className="section-header">
          <h2 className="section-title">
            <span>☕</span> Establecimientos Destacados
          </h2>
        </header>

        {loading ? (
          <div className="loading-box">
            <p>Cargando información...</p>
          </div>
        ) : lugaresFiltrados.length === 0 ? (
          <div className="empty-box">
            <p>No hay establecimientos disponibles para esta categoría.</p>
          </div>
        ) : (
          <div className="places-grid">
            {lugaresFiltrados.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </main>

      <ReservasPanel />

      <section className="dash-section" id="analitica">
        <div className="dash-container">
          <Dashboard />
        </div>
      </section>
    </div>
  );
}

export default App;