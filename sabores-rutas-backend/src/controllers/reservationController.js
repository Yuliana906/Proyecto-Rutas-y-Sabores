const pool = require('../config/db');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendEmailNotification } = require('../config/mailer');

const crearReserva = async (req, res) => {
  const { establecimiento_id, fecha_reserva, personas } = req.body;

  const lugar = await pool.query(
    `SELECT e.nombre, u.email AS email_dueno
     FROM establecimientos e LEFT JOIN usuarios u ON u.id = e.propietario_id
     WHERE e.id = $1`,
    [establecimiento_id]
  );
  if (!lugar.rows.length) throw new AppError('Establecimiento no encontrado', 404);

  const r = await pool.query(
    `INSERT INTO reservas (usuario_id, establecimiento_id, fecha_reserva, personas)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [req.user.id, establecimiento_id, fecha_reserva, personas || 2]
  );

  const usr = await pool.query('SELECT email FROM usuarios WHERE id = $1', [req.user.id]);
  const asunto = `Reserva en ${lugar.rows[0].nombre}`;

  // Si falla el correo, la reserva igual queda guardada
  sendEmailNotification(usr.rows[0].email, asunto, 'Tu reserva está pendiente de confirmación.').catch(console.error);
  if (lugar.rows[0].email_dueno) {
    sendEmailNotification(lugar.rows[0].email_dueno, 'Nueva reserva', `Tienes una nueva reserva para el ${fecha_reserva}.`)
      .catch(console.error);
  }

  res.status(201).json({ status: 'success', id: r.rows[0].id });
};

const misReservas = async (req, res) => {
  const result = await pool.query(
    `SELECT r.*, e.nombre AS local FROM reservas r
     JOIN establecimientos e ON e.id = r.establecimiento_id
     WHERE r.usuario_id = $1 ORDER BY r.fecha_reserva DESC`,
    [req.user.id]
  );
  res.json({ status: 'success', data: result.rows });
};

const reservasDeLocal = async (req, res) => {
  const result = await pool.query(
    `SELECT r.*, u.nombre AS cliente FROM reservas r
     JOIN establecimientos e ON e.id = r.establecimiento_id
     JOIN usuarios u ON u.id = r.usuario_id
     WHERE r.establecimiento_id = $1 AND (e.propietario_id = $2 OR $3 = 'ADMIN')
     ORDER BY r.fecha_reserva DESC`,
    [req.params.id, req.user.id, req.user.rol]
  );
  res.json({ status: 'success', data: result.rows });
};

const cambiarEstado = async (req, res) => {
  const { estado } = req.body;

  const result = await pool.query(
    `SELECT r.usuario_id, e.propietario_id FROM reservas r
     JOIN establecimientos e ON e.id = r.establecimiento_id
     WHERE r.id = $1`,
    [req.params.id]
  );
  if (!result.rows.length) throw new AppError('Reserva no encontrada', 404);

  const fila = result.rows[0];
  const esDueno = fila.propietario_id === req.user.id || req.user.rol === 'ADMIN';
  const esCliente = fila.usuario_id === req.user.id;

  // El cliente solo puede cancelar. El dueño puede cambiar a cualquier estado.
  if (!esDueno && !(esCliente && estado === 'CANCELADA')) {
    throw new AppError('No tienes permisos para cambiar esta reserva', 403);
  }

  await pool.query('UPDATE reservas SET estado = $1 WHERE id = $2', [estado, req.params.id]);
  res.json({ status: 'success', message: 'Estado actualizado' });
};

module.exports = {
  crearReserva: catchAsync(crearReserva),
  misReservas: catchAsync(misReservas),
  reservasDeLocal: catchAsync(reservasDeLocal),
  cambiarEstado: catchAsync(cambiarEstado)
};