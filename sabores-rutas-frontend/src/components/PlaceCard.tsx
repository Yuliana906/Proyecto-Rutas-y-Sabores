import type { Establecimiento } from '../types';

import cafeImg from '../assets/cafe.jpg';
import panaderiaImg from '../assets/panaderia.jpg';
import miradorImg from '../assets/mirador.jpg';
import plazaImg from '../assets/plaza.jpg';
import restauranteImg from '../assets/restaurante.jpg';
import defaultImg from '../assets/default.jpg';

interface PlaceCardProps {
  place: Establecimiento;
}

const selectCardImage = (nombre: string, categoriaId: number) => {
  const name = (nombre || '').toLowerCase();

  if (name.includes('café') || name.includes('cafe') || name.includes('pedro')) return cafeImg;
  if (name.includes('panadería') || name.includes('panaderia') || name.includes('espiga')) return panaderiaImg;
  if (name.includes('mirador') || name.includes('paisaje')) return miradorImg;
  if (name.includes('plaza') || name.includes('cultural') || name.includes('histórico')) return plazaImg;
  if (categoriaId === 1 || name.includes('restaurante') || name.includes('sabor')) return restauranteImg;

  return defaultImg;
};

export const PlaceCard = ({ place }: PlaceCardProps) => {
  const imageSrc = selectCardImage(place.nombre, place.categoria_id);

  const formatoPrecio = place.precio_promedio
    ? `$${Number(place.precio_promedio).toLocaleString('es-CO')}`
    : 'Variado';

  return (
    <article className="place-card">
      <div className="card-thumb">
        <img src={imageSrc} alt={place.nombre} className="card-img" />
        <span className="price-badge">{formatoPrecio}</span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{place.nombre}</h3>
        <p className="card-desc">{place.descripcion}</p>

        <div className="card-footer">
          <div className="address-tag">
            <span>📍</span>
            <span>{place.direccion}</span>
          </div>
        </div>
      </div>
    </article>
  );
};