const pool = require('../config/db');

const getCategorias = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY tipo, nombre');
    res.json({ status: 'success', data: result.rows });
  } catch (error) {
    console.error('Error en getCategorias:', error);
    next(error);
  }
};

module.exports = { getCategorias };