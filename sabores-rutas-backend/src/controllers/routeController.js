const crypto = require('crypto');
const pool = require('../config/db');
const AppError = require('../utils/AppError');

const createRoute = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { nombreRuta, descripcion, puntosInteres } = req.body;
    const token = crypto.randomUUID();

    await client.query('BEGIN');

    const rutaResult = await client.query(
      'INSERT INTO rutas (usuario_id, nombre, descripcion, token_publico, es_publica) VALUES ($1, $2, $3, $4, TRUE) RETURNING id',
      [req.user.id, nombreRuta, descripcion || null, token]
    );
    const rutaId = rutaResult.rows[0].id;

    if (puntosInteres && Array.isArray(puntosInteres)) {
      for (let i = 0; i < puntosInteres.length; i++) {
        await client.query(
          'INSERT INTO ruta_paradas (ruta_id, establecimiento_id, orden, nota) VALUES ($1, $2, $3, $4)',
          [rutaId, puntosInteres[i].establecimiento_id, i + 1, puntosInteres[i].nota || null]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json({
      status: 'success',
      message: 'Ruta turística creada correctamente',
      data: {
        id: rutaId,
        enlacePublico: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/r/${token}`
      }
    });
  } catch (e) {
    await client.query('ROLLBACK');
    next(e);
  } finally {
    client.release();
  }
};

const getMisRutas = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rutas WHERE usuario_id = $1 ORDER BY fecha_creacion DESC',
      [req.user.id]
    );
    res.json({ status: 'success', data: result.rows });
  } catch (error) {
    next(error);
  }
};

const getRutaPublica = async (req, res, next) => {
  try {
    const rutaResult = await pool.query(
      'SELECT id, nombre, descripcion, fecha_creacion FROM rutas WHERE token_publico = $1 AND es_publica = TRUE',
      [req.params.token]
    );
    if (!rutaResult.rows.length) throw new AppError('Ruta no encontrada', 404);

    const ruta = rutaResult.rows[0];

    const paradasResult = await pool.query(
      `SELECT p.orden, p.nota, e.id, e.nombre, e.direccion, e.latitud, e.longitud
       FROM ruta_paradas p JOIN establecimientos e ON e.id = p.establecimiento_id
       WHERE p.ruta_id = $1 ORDER BY p.orden`,
      [ruta.id]
    );

    res.json({ status: 'success', data: { ...ruta, paradas: paradasResult.rows } });
  } catch (error) {
    next(error);
  }
};

const deleteRoute = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM rutas WHERE id = $1 AND usuario_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) throw new AppError('Ruta no encontrada', 404);

    res.json({ status: 'success', message: `Ruta con ID ${req.params.id} eliminada correctamente` });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRoute, getMisRutas, getRutaPublica, deleteRoute };