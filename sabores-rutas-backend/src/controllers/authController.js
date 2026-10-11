const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const firmar = (user) =>
  jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d'
  });

const register = async (req, res) => {
  const { nombre, email, password, telefono } = req.body;

  const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
  if (existe.rows.length) throw new AppError('El email ya está registrado', 409);

  const hash = await bcrypt.hash(password, 10);
  const r = await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash, telefono) VALUES ($1, $2, $3, $4) RETURNING id',
    [nombre, email, hash, telefono || null]
  );

  const user = { id: r.rows[0].id, nombre, email, rol: 'CLIENTE' };
  res.status(201).json({ status: 'success', token: firmar(user), user });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError('Credenciales incorrectas', 401);
  }

  res.json({
    status: 'success',
    token: firmar(user),
    user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
  });
};

const me = async (req, res) => {
  const result = await pool.query(
    'SELECT id, nombre, email, rol, telefono, fecha_registro FROM usuarios WHERE id = $1',
    [req.user.id]
  );
  if (!result.rows.length) throw new AppError('Usuario no encontrado', 404);
  res.json({ status: 'success', data: result.rows[0] });
};

module.exports = {
  register: catchAsync(register),
  login: catchAsync(login),
  me: catchAsync(me)
};