const QRCode = require('qrcode');
const pool = require('../config/db');
const AppError = require('../utils/AppError');

const verificarDueno = async (establecimientoId, user) => {
  const result = await pool.query(
    'SELECT propietario_id FROM establecimientos WHERE id = $1',
    [establecimientoId]
  );
  if (!result.rows.length) throw new AppError('Establecimiento no encontrado', 404);
  if (result.rows[0].propietario_id !== user.id && user.rol !== 'ADMIN') {
    throw new AppError('Este local no es tuyo', 403);
  }
};

const getMenu = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM menu_platos WHERE establecimiento_id = $1 AND disponible = TRUE',
      [req.params.id]
    );
    res.json({ status: 'success', data: result.rows });
  } catch (error) {
    next(error);
  }
};

const crearPlato = async (req, res, next) => {
  try {
    const { establecimiento_id, nombre_plato, descripcion, precio, alergenos } = req.body;
    await verificarDueno(establecimiento_id, req.user);

    const result = await pool.query(
      `INSERT INTO menu_platos (establecimiento_id, nombre_plato, descripcion, precio, alergenos)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [establecimiento_id, nombre_plato, descripcion || null, precio, alergenos || null]
    );
    res.status(201).json({ status: 'success', id: result.rows[0].id });
  } catch (error) {
    next(error);
  }
};

const actualizarPlato = async (req, res, next) => {
  try {
    const { nombre_plato, descripcion, precio, disponible, alergenos } = req.body;

    const platoResult = await pool.query('SELECT establecimiento_id FROM menu_platos WHERE id = $1', [req.params.id]);
    if (!platoResult.rows.length) throw new AppError('Plato no encontrado', 404);
    await verificarDueno(platoResult.rows[0].establecimiento_id, req.user);

    await pool.query(
      `UPDATE menu_platos SET nombre_plato = $1, descripcion = $2, precio = $3, disponible = $4, alergenos = $5
       WHERE id = $6`,
      [nombre_plato, descripcion, precio, disponible, alergenos, req.params.id]
    );
    res.json({ status: 'success', message: 'Plato actualizado' });
  } catch (error) {
    next(error);
  }
};

const eliminarPlato = async (req, res, next) => {
  try {
    const platoResult = await pool.query('SELECT establecimiento_id FROM menu_platos WHERE id = $1', [req.params.id]);
    if (!platoResult.rows.length) throw new AppError('Plato no encontrado', 404);
    await verificarDueno(platoResult.rows[0].establecimiento_id, req.user);

    await pool.query('DELETE FROM menu_platos WHERE id = $1', [req.params.id]);
    res.json({ status: 'success', message: 'Plato eliminado' });
  } catch (error) {
    next(error);
  }
};

const generarQR = async (req, res, next) => {
  try {
    await verificarDueno(req.params.id, req.user);
    const url = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/${req.params.id}`;
    const qr = await QRCode.toDataURL(url);
    res.json({ status: 'success', data: { url, qr } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMenu, crearPlato, actualizarPlato, eliminarPlato, generarQR };