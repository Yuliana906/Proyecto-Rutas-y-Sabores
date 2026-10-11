import { useCallback, useEffect, useState } from 'react';
import hero1 from '../assets/hero.jpg';
import hero2 from '../assets/hero2.jpg';
import hero3 from '../assets/hero3.jpg';

const slides = [
  {
    img: hero1,
    pill: '🏔️ Santuario, Risaralda',
    title: 'Ruta Gastronómica & Cultural',
    text: 'Descubre los mejores cafés de origen, gastronomía tradicional y paisajes inolvidables al pie del Parque Nacional Natural Tatamá.',
  },
  {
    img: hero2,
    pill: '☕ Café de origen',
    title: 'El sabor de la montaña en cada taza',
    text: 'Prueba café de alta montaña, panadería artesanal y recetas que se han heredado por generaciones.',
  },
  {
    img: hero3,
    pill: '🌄 Naturaleza y miradores',
    title: 'Paisajes que no vas a olvidar',
    text: 'Atardeceres frente al Tatamá, calles coloridas y rincones perfectos para llevarte en fotos y recuerdos.',
  },
];

const INTERVALO = 6000;

export default function HeroCarousel() {
  const [actual, setActual] = useState(0);
  const [pausa, setPausa] = useState(false);

  const siguiente = useCallback(
    () => setActual((i) => (i + 1) % slides.length),
    []
  );
  const anterior = () =>
    setActual((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (pausa) return;
    const id = setInterval(siguiente, INTERVALO);
    return () => clearInterval(id);
  }, [pausa, siguiente, actual]);

  const s = slides[actual];

  return (
    <section
      className="hc"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
    >
      {slides.map((sl, i) => (
        <div
          key={i}
          className={`hc-slide ${i === actual ? 'is-active' : ''}`}
          style={{ backgroundImage: `url(${sl.img})` }}
          aria-hidden={i !== actual}
        />
      ))}
      <div className="hc-overlay" />

      <div className="hc-body" key={actual}>
        <div className="hc-pill">{s.pill}</div>
        <h1 className="hc-title">{s.title}</h1>
        <p className="hc-text">{s.text}</p>
        <div className="hc-actions">
          <a href="#lugares" className="hc-btn hc-btn--primary">
            Explorar lugares
          </a>
          <a href="#reservas" className="hc-btn hc-btn--glass">
            Reservar ahora
          </a>
        </div>
      </div>

      <button className="hc-arrow hc-arrow--left" onClick={anterior} aria-label="Anterior">
        ‹
      </button>
      <button className="hc-arrow hc-arrow--right" onClick={siguiente} aria-label="Siguiente">
        ›
      </button>

      <div className="hc-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hc-dot ${i === actual ? 'is-active' : ''}`}
            onClick={() => setActual(i)}
            aria-label={`Ir a la imagen ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}