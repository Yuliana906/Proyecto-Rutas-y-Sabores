const pool = require('../config/db');
const AppError = require('../utils/AppError');

const getEstablecimientos = async (req, res, next) => {
  try {
    const { lat, lng, radioKm = 5, categoria, precioMax, q, page = 1, limit = 20 } = req.query;
    const params = [];
    const where = [];
    let select = 'e.*';
    let order = 'e.valoracion_prom DESC';

    if (lat && lng) {
      params.push(Number(lat), Number(lng));
      const dist = `(6371 * ACOS(LEAST(1, COS(RADIANS($1)) * COS(RADIANS(e.latitud)) * COS(RADIANS(e.longitud) - RADIANS($2)) + SIN(RADIANS($1)) * SIN(RADIANS(e.latitud)))))`;
      select += `, ${dist} AS distancia_km`;
      params.push(Number(radioKm));
      where.push(`${dist} <= $${params.length}`);
      order = 'distancia_km';
    }
    if (categoria) {
      params.push(Number(categoria));
      where.push(`e.categoria_id = $${params.length}`);
    }
    if (precioMax) {
      params.push(Number(precioMax));
      where.push(`e.precio_promedio <= $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      where.push(`e.nombre ILIKE $${params.length}`);
    }

    const lim = Math.min(Number(limit) || 20, 50);
    const offset = ((Number(page) || 1) - 1) * lim;
    params.push(lim, offset);

    const sql = `SELECT ${select} FROM establecimientos e
                 ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
                 ORDER BY ${order}
                 LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await pool.query(sql, params);
    res.json({ status: 'success', data: result.rows });
  } catch (error) {
    next(error);
  }
};

const getEstablecimientoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lugarResult = await pool.query('SELECT * FROM establecimientos WHERE id = $1', [id]);
    if (!lugarResult.rows.length) throw new AppError('Establecimiento no encontrado', 404);

    const menuResult = await pool.query(
      'SELECT * FROM menu_platos WHERE establecimiento_id = $1 AND disponible = TRUE',
      [id]
    );

    const resenasResult = await pool.query(
      `SELECT r.id, r.calificacion, r.comentario, r.fecha, u.nombre AS autor
       FROM resenas r JOIN usuarios u ON u.id = r.usuario_id
       WHERE r.establecimiento_id = $1 ORDER BY r.fecha DESC`,
      [id]
    );

    res.json({
      status: 'success',
      data: {
        ...lugarResult.rows[0],
        menu: menuResult.rows,
        resenas: resenasResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
};

const crearEstablecimiento = async (req, res, next) => {
  try {
    const { categoria_id, nombre, descripcion, direccion, latitud, longitud, precio_promedio } = req.body;

    const result = await pool.query(
      `INSERT INTO establecimientos
       (propietario_id, categoria_id, nombre, descripcion, direccion, latitud, longitud, precio_promedio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [req.user.id, categoria_id, nombre, descripcion || null, direccion, latitud, longitud, precio_promedio || 0]
    );

    res.status(201).json({ status: 'success', id: result.rows[0].id });
  } catch (error) {
    next(error);
  }
};

const actualizarEstablecimiento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, direccion, precio_promedio } = req.body;

    const result = await pool.query(
      `UPDATE establecimientos SET nombre = $1, descripcion = $2, direccion = $3, precio_promedio = $4
       WHERE id = $5 AND (propietario_id = $6 OR $7 = 'ADMIN') RETURNING id`,
      [nombre, descripcion, direccion, precio_promedio, id, req.user.id, req.user.rol]
    );

    if (!result.rows.length) throw new AppError('No encontrado o sin permisos', 404);

    res.json({ status: 'success', message: 'Establecimiento actualizado' });
  } catch (error) {
    next(error);
  }
};

const eliminarEstablecimiento = async (req, res, next) => {
  try {
    const result = await pool.query(
      `DELETE FROM establecimientos WHERE id = $1 AND (propietario_id = $2 OR $3 = 'ADMIN') RETURNING id`,
      [req.params.id, req.user.id, req.user.rol]
    );

    if (!result.rows.length) throw new AppError('No encontrado o sin permisos', 404);

    res.json({ status: 'success', message: 'Establecimiento eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEstablecimientos,
  getEstablecimientoById,
  crearEstablecimiento,
  actualizarEstablecimiento,
  eliminarEstablecimiento
};