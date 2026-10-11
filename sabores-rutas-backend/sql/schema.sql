-- =========================================================
-- PROYECTO: Sabores & Rutas Santuario (Risaralda)
-- ESTRUCTURA DE BASE DE DATOS (SCHEMA POSTGRESQL / SUPABASE)
-- =========================================================

-- 1. LIMPIEZA DE TABLAS Y TIPOS PREEXISTENTES
DROP TABLE IF EXISTS auditoria CASCADE;
DROP TABLE IF EXISTS establecimiento_etiquetas CASCADE;
DROP TABLE IF EXISTS etiquetas CASCADE;
DROP TABLE IF EXISTS ruta_paradas CASCADE;
DROP TABLE IF EXISTS rutas CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS resenas CASCADE;
DROP TABLE IF EXISTS menu_platos CASCADE;
DROP TABLE IF EXISTS establecimientos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

DROP TYPE IF EXISTS rol_usuario CASCADE;
DROP TYPE IF EXISTS tipo_categoria CASCADE;
DROP TYPE IF EXISTS estado_reserva CASCADE;

-- 2. CREACIÓN DE TIPOS ENUMERADOS (ENUMS)
CREATE TYPE rol_usuario AS ENUM ('CLIENTE', 'PROPIETARIO', 'ADMIN');
CREATE TYPE tipo_categoria AS ENUM ('GASTRONOMIA', 'TURISMO');
CREATE TYPE estado_reserva AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA');

-- 3. TABLAS

-- Tabla Usuarios
CREATE TABLE usuarios (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol rol_usuario NOT NULL DEFAULT 'CLIENTE',
  telefono VARCHAR(20),
  acepta_politica BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_aceptacion TIMESTAMPTZ NULL,
  fecha_registro TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Categorías
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  tipo tipo_categoria NOT NULL,
  icono_url VARCHAR(255) NULL
);

-- Tabla Establecimientos
CREATE TABLE establecimientos (
  id BIGSERIAL PRIMARY KEY,
  propietario_id BIGINT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  categoria_id INT NOT NULL REFERENCES categorias(id),
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  direccion VARCHAR(255) NOT NULL,
  latitud NUMERIC(10, 8) NOT NULL,
  longitud NUMERIC(11, 8) NOT NULL,
  precio_promedio NUMERIC(10, 2) DEFAULT 0.00,
  valoracion_prom NUMERIC(3, 2) DEFAULT 0.00,
  imagen_portada VARCHAR(255) NULL
);

-- Tabla Menú / Platos
CREATE TABLE menu_platos (
  id BIGSERIAL PRIMARY KEY,
  establecimiento_id BIGINT NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
  nombre_plato VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(10, 2) NOT NULL,
  disponible BOOLEAN NOT NULL DEFAULT TRUE,
  alergenos VARCHAR(255) NULL,
  imagen_url VARCHAR(255) NULL
);

-- Tabla Reseñas
CREATE TABLE resenas (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  establecimiento_id BIGINT NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
  calificacion SMALLINT NOT NULL,
  comentario TEXT,
  fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_calificacion CHECK (calificacion BETWEEN 1 AND 5),
  CONSTRAINT uq_resena UNIQUE (usuario_id, establecimiento_id)
);

-- Tabla Reservas
CREATE TABLE reservas (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  establecimiento_id BIGINT NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
  fecha_reserva TIMESTAMPTZ NOT NULL,
  personas INT NOT NULL DEFAULT 2,
  estado estado_reserva NOT NULL DEFAULT 'PENDIENTE',
  CONSTRAINT chk_personas CHECK (personas >= 1)
);

-- Tabla Rutas
CREATE TABLE rutas (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  token_publico CHAR(36) NOT NULL UNIQUE,
  es_publica BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Paradas de Ruta
CREATE TABLE ruta_paradas (
  id BIGSERIAL PRIMARY KEY,
  ruta_id BIGINT NOT NULL REFERENCES rutas(id) ON DELETE CASCADE,
  establecimiento_id BIGINT NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
  orden INT NOT NULL,
  nota VARCHAR(255)
);

-- Tablas de Etiquetas
CREATE TABLE etiquetas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE establecimiento_etiquetas (
  establecimiento_id BIGINT NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
  etiqueta_id INT NOT NULL REFERENCES etiquetas(id) ON DELETE CASCADE,
  PRIMARY KEY (establecimiento_id, etiqueta_id)
);

-- Tabla Auditoría
CREATE TABLE auditoria (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NULL,
  accion VARCHAR(100) NOT NULL,
  entidad VARCHAR(50),
  entidad_id BIGINT,
  fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. ÍNDICES DE RENDIMIENTO
CREATE INDEX idx_est_geo ON establecimientos (latitud, longitud);
CREATE INDEX idx_est_cat ON establecimientos (categoria_id);
CREATE INDEX idx_menu_est ON menu_platos (establecimiento_id);
CREATE INDEX idx_res_est ON resenas (establecimiento_id);
CREATE INDEX idx_reserva_usr ON reservas (usuario_id);
CREATE INDEX idx_reserva_est ON reservas (establecimiento_id);