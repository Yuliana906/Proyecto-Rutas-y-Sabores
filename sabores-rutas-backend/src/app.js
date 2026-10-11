require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad y registros
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

// Ruta de comprobación de estado
app.get('/health', (req, res) => res.json({ ok: true }));

// Rutas principales de la API
app.use('/api/v1', apiRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

// Middleware global de errores
app.use(errorHandler);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor de Sabores & Rutas escuchando en http://localhost:${PORT}`);
});