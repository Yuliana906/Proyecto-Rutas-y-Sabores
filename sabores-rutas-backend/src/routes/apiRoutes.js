const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const router = express.Router();

const validate = require('../middlewares/validate');
const { verifyToken, checkRole } = require('../middlewares/authJwt');

const auth = require('../controllers/authController');
const place = require('../controllers/placeController');
const route = require('../controllers/routeController');
const reserva = require('../controllers/reservationController');
const review = require('../controllers/reviewController');
const menu = require('../controllers/menuController');
const category = require('../controllers/categoryController');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { status: 'error', message: 'Demasiados intentos, intenta en 15 minutos' }
});

const soloDueno = [verifyToken, checkRole('PROPIETARIO', 'ADMIN')];

// ---------- PÚBLICOS ----------
router.post('/auth/register',
  body('nombre').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  validate, auth.register);

router.post('/auth/login', loginLimiter,
  body('email').isEmail(),
  body('password').notEmpty(),
  validate, auth.login);

router.get('/categorias', category.getCategorias);
router.get('/establecimientos', place.getEstablecimientos);
router.get('/establecimientos/:id', place.getEstablecimientoById);
router.get('/establecimientos/:id/menu', menu.getMenu);
router.get('/establecimientos/:id/resenas', review.getResenas);
router.get('/rutas/publica/:token', route.getRutaPublica);

// ---------- CLIENTE (JWT) ----------
router.get('/auth/me', verifyToken, auth.me);

router.post('/rutas', verifyToken,
  body('nombreRuta').trim().notEmpty(),
  body('puntosInteres').isArray({ min: 1 }),
  body('puntosInteres.*.establecimiento_id').isInt(),
  validate, route.createRoute);
router.get('/rutas', verifyToken, route.getMisRutas);
router.delete('/rutas/:id', verifyToken, route.deleteRoute);

router.post('/reservas', verifyToken,
  body('establecimiento_id').isInt(),
  body('fecha_reserva').isISO8601(),
  body('personas').optional().isInt({ min: 1 }),
  validate, reserva.crearReserva);
router.get('/reservas/mias', verifyToken, reserva.misReservas);
router.patch('/reservas/:id/estado', verifyToken,
  body('estado').isIn(['CONFIRMADA', 'CANCELADA', 'COMPLETADA']),
  validate, reserva.cambiarEstado);

router.post('/resenas', verifyToken,
  body('establecimiento_id').isInt(),
  body('calificacion').isInt({ min: 1, max: 5 }),
  validate, review.crearResena);

// ---------- PROPIETARIO / ADMIN ----------
router.post('/establecimientos', ...soloDueno,
  body('categoria_id').isInt(),
  body('nombre').trim().notEmpty(),
  body('direccion').trim().notEmpty(),
  body('latitud').isFloat({ min: -90, max: 90 }),
  body('longitud').isFloat({ min: -180, max: 180 }),
  validate, place.crearEstablecimiento);
router.put('/establecimientos/:id', ...soloDueno, place.actualizarEstablecimiento);
router.delete('/establecimientos/:id', ...soloDueno, place.eliminarEstablecimiento);
router.get('/establecimientos/:id/qr', ...soloDueno, menu.generarQR);
router.get('/reservas/local/:id', ...soloDueno, reserva.reservasDeLocal);

router.post('/menu/plato', ...soloDueno,
  body('establecimiento_id').isInt(),
  body('nombre_plato').trim().notEmpty(),
  body('precio').isFloat({ min: 0 }),
  validate, menu.crearPlato);
router.put('/menu/plato/:id', ...soloDueno, menu.actualizarPlato);
router.delete('/menu/plato/:id', ...soloDueno, menu.eliminarPlato);

module.exports = router;