import { useEffect, useState } from 'react';
import { api, getEstablecimientos } from '../services/api';
import type { Establecimiento } from '../types';
import heroImg from '../assets/hero.jpg';

export default function ReservasPanel() {
  const [logueado, setLogueado] = useState(!!localStorage.getItem('token'));
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [auth, setAuth] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    acepta_politica: false,
  });
  const [lugares, setLugares] = useState<Establecimiento[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);
  const [form, setForm] = useState({ establecimiento_id: '', fecha_reserva: '', personas: 2 });
  const [msg, setMsg] = useState('');

  const cargarReservas = async () => {
    try {
      const j = await api('/reservas/mias');
      setReservas(j.data ?? j.reservas ?? []);
    } catch (e: any) { setMsg('❌ ' + e.message); }
  };

  useEffect(() => { getEstablecimientos().then(setLugares); }, []);
  useEffect(() => { if (logueado) cargarReservas(); }, [logueado]);

  const entrar = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      if (modo === 'registro') {
        if (!auth.acepta_politica) {
          setMsg('❌ Debes aceptar la política de tratamiento de datos');
          return;
        }
        await api('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            nombre: auth.nombre,
            email: auth.email,
            password: auth.password,
            telefono: auth.telefono,
            acepta_politica: auth.acepta_politica,
            fecha_aceptacion: new Date().toISOString(),
          }),
        });
      }
      const j = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: auth.email, password: auth.password }),
      });
      localStorage.setItem('token', j.token);
      setLogueado(true);
      setMsg('✅ Sesión iniciada');
    } catch (err: any) { setMsg('❌ ' + err.message); }
  };

  const salir = () => {
    localStorage.removeItem('token');
    setLogueado(false);
    setReservas([]);
    setMsg('');
  };

  const reservar = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await api('/reservas', {
        method: 'POST',
        body: JSON.stringify({
          establecimiento_id: Number(form.establecimiento_id),
          fecha_reserva: form.fecha_reserva,
          personas: form.personas,
        }),
      });
      setMsg('✅ ¡Reserva guardada con éxito!');
      cargarReservas();
    } catch (err: any) { setMsg('❌ ' + err.message); }
  };

  const cancelar = async (id: number) => {
    try {
      await api(`/reservas/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: 'CANCELADA' }),
      });
      setMsg('✅ Reserva cancelada');
      cargarReservas();
    } catch (err: any) { setMsg('❌ ' + err.message); }
  };

  const msgClass = msg.startsWith('✅') ? 'rv-msg rv-msg--ok' : 'rv-msg rv-msg--error';

  return (
    <section className="rv-section" id="reservas">
      <div className="rv-card">
        {/* ---------- Columna visual ---------- */}
        <aside className="rv-aside" style={{ backgroundImage: `url(${heroImg})` }}>
          <div className="rv-aside-overlay" />
          <div className="rv-aside-content">
            <span className="rv-pill">🏔️ Santuario, Risaralda</span>
            <h2>Reserva tu experiencia</h2>
            <p>Asegura tu mesa o tu visita en los mejores lugares al pie del Tatamá.</p>
            <ul>
              <li>☕ Cafés de origen y gastronomía local</li>
              <li>📅 Reserva en menos de un minuto</li>
              <li>✅ Cancela cuando lo necesites</li>
            </ul>
          </div>
        </aside>

        {/* ---------- Columna de contenido ---------- */}
        <div className="rv-main">
          {!logueado ? (
            <>
              <h3 className="rv-title">
                {modo === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
              </h3>
              <p className="rv-subtitle">
                {modo === 'login'
                  ? 'Inicia sesión para reservar y ver tus reservas.'
                  : 'Regístrate gratis y empieza a reservar.'}
              </p>

              <form className="rv-form" onSubmit={entrar}>
                {modo === 'registro' && (
                  <label className="rv-field">
                    <span>Nombre</span>
                    <input
                      placeholder="Tu nombre"
                      value={auth.nombre}
                      onChange={(e) => setAuth({ ...auth, nombre: e.target.value })}
                      required
                    />
                  </label>
                )}
                <label className="rv-field">
                  <span>Correo electrónico</span>
                  <input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={auth.email}
                    onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                    required
                  />
                </label>
                <label className="rv-field">
                  <span>Contraseña</span>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    value={auth.password}
                    onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                    required
                  />
                </label>

                {modo === 'registro' && (
                  <>
                    <label className="rv-field">
                      <span>Teléfono</span>
                      <input
                        type="tel"
                        placeholder="3001234567"
                        pattern="3[0-9]{9}"
                        title="Celular colombiano de 10 dígitos, empieza por 3"
                        value={auth.telefono}
                        onChange={(e) => setAuth({ ...auth, telefono: e.target.value })}
                        required
                      />
                    </label>

                    <label className="rv-check">
                      <input
                        type="checkbox"
                        checked={auth.acepta_politica}
                        onChange={(e) => setAuth({ ...auth, acepta_politica: e.target.checked })}
                        required
                      />
                      <span>
                        Acepto la política de tratamiento de datos personales y autorizo
                        el uso de mi información para gestionar mis reservas.
                      </span>
                    </label>
                  </>
                )}

                <button type="submit" className="rv-btn rv-btn--primary">
                  {modo === 'login' ? 'Entrar' : 'Registrarme'}
                </button>
              </form>

              <p className="rv-switch">
                {modo === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                <button
                  type="button"
                  onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setMsg(''); }}
                >
                  {modo === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
              </p>
              {msg && <p className={msgClass}>{msg}</p>}
            </>
          ) : (
            <>
              <div className="rv-head">
                <div>
                  <h3 className="rv-title">Reservar un lugar</h3>
                  <p className="rv-subtitle">Elige el lugar, la fecha y cuántas personas van.</p>
                </div>
                <button className="rv-btn rv-btn--ghost" onClick={salir}>Cerrar sesión</button>
              </div>

              <form className="rv-form rv-form--grid" onSubmit={reservar}>
                <label className="rv-field rv-field--wide">
                  <span>Lugar</span>
                  <select
                    value={form.establecimiento_id}
                    onChange={(e) => setForm({ ...form, establecimiento_id: e.target.value })}
                    required
                  >
                    <option value="">Elige un lugar...</option>
                    {lugares.map((l) => (
                      <option key={l.id} value={l.id}>{l.nombre}</option>
                    ))}
                  </select>
                </label>
                <label className="rv-field">
                  <span>Fecha y hora</span>
                  <input
                    type="datetime-local"
                    value={form.fecha_reserva}
                    onChange={(e) => setForm({ ...form, fecha_reserva: e.target.value })}
                    required
                  />
                </label>
                <label className="rv-field">
                  <span>Personas</span>
                  <input
                    type="number"
                    min={1}
                    value={form.personas}
                    onChange={(e) => setForm({ ...form, personas: Number(e.target.value) })}
                    required
                  />
                </label>
                <button type="submit" className="rv-btn rv-btn--primary rv-field--wide">
                  Reservar ahora
                </button>
              </form>

              {msg && <p className={msgClass}>{msg}</p>}

              <h4 className="rv-list-title">Mis reservas</h4>
              {reservas.length === 0 ? (
                <p className="rv-empty">Aún no tienes reservas. ¡Haz la primera! 🌄</p>
              ) : (
                <div className="rv-table-wrap">
                  <table className="rv-table">
                    <thead>
                      <tr>
                        <th>Lugar</th><th>Fecha</th><th>Pers.</th><th>Estado</th><th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.map((r) => (
                        <tr key={r.id}>
                          <td>{r.establecimiento ?? r.establecimiento_nombre ?? r.nombre ?? r.establecimiento_id}</td>
                          <td>{new Date(r.fecha_reserva).toLocaleString()}</td>
                          <td>{r.personas}</td>
                          <td>
                            <span className={`rv-badge rv-badge--${String(r.estado).toLowerCase()}`}>
                              {r.estado}
                            </span>
                          </td>
                          <td>
                            {(r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA') && (
                              <button className="rv-link-danger" onClick={() => cancelar(r.id)}>
                                Cancelar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}