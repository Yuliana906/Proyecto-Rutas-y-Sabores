const pool = require('../config/db');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const crearResena = async (req, res) => {
  const { establecimiento_id, calificacion, comentario } = req.body;

  // RF-04: solo puede reseñar quien tenga una reserva completada en ese local
  const visita = await pool.query(
    `SELECT id FROM reservas
     WHERE usuario_id = $1 AND establecimiento_id = $2 AND estado = 'COMPLETADA' LIMIT 1`,
    [req.user.id, establecimiento_id]
  );
  if (!visita.rows.length) throw new AppError('Solo puedes reseñar locales que visitaste', 403);

  try {
    await pool.query(
      'INSERT INTO resenas (usuario_id, establecimiento_id, calificacion, comentario) VALUES ($1, $2, $3, $4)',
      [req.user.id, establecimiento_id, calificacion, comentario || null]
    );
  } catch (e) {
    if (e.code === '23505') throw new AppError('Ya reseñaste este local', 409);
    throw e;
  }

  await pool.query(
    `UPDATE establecimientos SET valoracion_prom =
     (SELECT ROUND(AVG(calificacion), 2) FROM resenas WHERE establecimiento_id = $1) WHERE id = $1`,
    [establecimiento_id]
  );

  res.status(201).json({ status: 'success', message: 'Reseña publicada' });
};

const getResenas = async (req, res) => {
  const result = await pool.query(
    `SELECT r.id, r.calificacion, r.comentario, r.fecha, u.nombre AS autor
     FROM resenas r JOIN usuarios u ON u.id = r.usuario_id
     WHERE r.establecimiento_id = $1 ORDER BY r.fecha DESC`,
    [req.params.id]
  );
  res.json({ status: 'success', data: result.rows });
};

module.exports = {
  crearResena: catchAsync(crearResena),
  getResenas: catchAsync(getResenas)
};