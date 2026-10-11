import type { Categoria } from '../types';

interface CategoryFilterProps {
  categorias: Categoria[];
  categoriaSeleccionada: number | null;
  onSelectCategoria: (id: number | null) => void;
}

const getCategoryIcon = (nombre: string) => {
  const name = (nombre || '').toLowerCase();
  if (name.includes('café') || name.includes('cafe')) return '☕';
  if (name.includes('restaurante')) return '🍽️';
  if (name.includes('panadería') || name.includes('panaderia')) return '🥐';
  if (name.includes('mirador')) return '🌄';
  if (name.includes('histórico') || name.includes('cultural') || name.includes('plaza')) return '🏛️';
  return '🏷️';
};

export const CategoryFilter = ({
  categorias,
  categoriaSeleccionada,
  onSelectCategoria,
}: CategoryFilterProps) => {
  return (
    <div className="category-filter-container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
      <button
        type="button"
        className={`filter-btn ${categoriaSeleccionada === null ? 'active' : ''}`}
        onClick={() => onSelectCategoria(null)}
      >
        ✨ Todos los Lugares
      </button>

      {categorias.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`filter-btn ${categoriaSeleccionada === cat.id ? 'active' : ''}`}
          onClick={() => onSelectCategoria(cat.id)}
        >
          <span>{getCategoryIcon(cat.nombre)}</span>
          <span>{cat.nombre}</span>
        </button>
      ))}
    </div>
  );
};