-- =========================================================
-- PROYECTO: Sabores & Rutas Santuario (Risaralda)
-- DATOS INICIALES DE PRUEBA (SEED POSTGRESQL / SUPABASE)
-- =========================================================

-- 1. Categorías
INSERT INTO categorias (id, nombre, tipo) VALUES
  (1, 'Restaurante', 'GASTRONOMIA'),
  (2, 'Café', 'GASTRONOMIA'),
  (3, 'Panadería', 'GASTRONOMIA'),
  (4, 'Mirador', 'TURISMO'),
  (5, 'Sitio histórico', 'TURISMO'),
  (6, 'Naturaleza', 'TURISMO');

-- 2. Etiquetas
INSERT INTO etiquetas (id, nombre) VALUES
  (1, 'Comida típica'),
  (2, 'Café de origen'),
  (3, 'Familiar'),
  (4, 'Vegetariano'),
  (5, 'Vista panorámica'),
  (6, 'Gratis');

-- 3. Usuarios de prueba
INSERT INTO usuarios (id, nombre, email, password_hash, rol, telefono, acepta_politica, fecha_aceptacion, fecha_registro) VALUES
  (1, 'Admin Principal', 'admin@saboresyrutas.com', '$2b$10$e8Rk8V.9yvLpU1101919191919191919191919191919191919', 'ADMIN', '3000000000', TRUE, NOW(), '2026-01-10 08:00:00'),
  (2, 'Juan Propietario', 'juan@restaurante.com', '$2b$10$e8Rk8V.9yvLpU1101919191919191919191919191919191919', 'PROPIETARIO', '3111111111', TRUE, NOW(), '2026-01-12 09:30:00'),
  (3, 'Maria Cliente', 'maria@cliente.com', '$2b$10$e8Rk8V.9yvLpU1101919191919191919191919191919191919', 'CLIENTE', '3222222222', TRUE, NOW(), '2026-02-01 10:15:00'),
  (4, 'Carlos Propietario', 'carlos@hotel.com', '$2b$10$e8Rk8V.9yvLpU1101919191919191919191919191919191919', 'PROPIETARIO', '3133333333', TRUE, NOW(), '2026-02-10 11:20:00'),
  (5, 'Ana Cliente', 'ana@cliente.com', '$2b$10$e8Rk8V.9yvLpU1101919191919191919191919191919191919', 'CLIENTE', '3244444444', TRUE, NOW(), '2026-03-05 14:00:00'),
  (6, 'Pedro Gómez', 'pedro@gmail.com', '$2b$10$e8Rk8V.9yvLpU1101919191919191919191919191919191919', 'CLIENTE', '3155555555', TRUE, NOW(), '2026-03-12 16:30:00'),
  (7, 'Laura Restrepo', 'laura@hotmail.com', '$2b$10$e8Rk8V.9yvLpU1101919191919191919191919191919191919', 'CLIENTE', '3166666666', TRUE, NOW(), '2026-04-02 09:10:00'),
  (8, 'Diego Morales', 'diego@yahoo.com', '$2b$10$e8Rk8V.9yvLpU1101919191919191919191919191919191919', 'CLIENTE', '3177777777', TRUE, NOW(), '2026-04-15 18:45:00'),
  (9, 'Sofia Valencia', 'sofia@outlook.com', '$2b$10$e8Rk8V.9yvLpU1101919191919191919191919191919191919', 'CLIENTE', '3188888888', TRUE, NOW(), '2026-05-01 12:20:00'),
  (10, 'Andrés Castro', 'andres@gmail.com', '$2b$10$e8Rk8V.9yvLpU1101919191919191919191919191919191919', 'CLIENTE', '3199999999', TRUE, NOW(), '2026-05-20 15:00:00');

-- 4. Establecimientos Reales de Santuario, Risaralda
INSERT INTO establecimientos (id, propietario_id, categoria_id, nombre, descripcion, direccion, latitud, longitud, precio_promedio, valoracion_prom) VALUES
  (1, 2, 1, 'Restaurante El Deleite de Santuario', 'Especialidad en comida típica tradicional y sazón santuareña.', 'Carrera 5 # 5-15', 5.07430000, -75.96410000, 28000.00, 4.80),
  (2, 2, 2, 'Ancestral Café y Helado', 'Café especial de origen de alta montaña con helados y repostería artesanal.', 'Carrera 6 # 6-39', 5.07480000, -75.96380000, 10000.00, 4.90),
  (3, NULL, 1, 'Restaurante Tatamá', 'Comida tradicional y platos típicos de la región cafetero-andina.', 'Calle 6 # 6-1', 5.07450000, -75.96450000, 25000.00, 4.50),
  (4, NULL, 4, 'Mirador Panorámico Tatamá', 'Lugar panorámico ideal para fotografías del atardecer y vista al Parque Nacional Natural Tatamá.', 'Carrera 9 # 10-2', 5.07620000, -75.96210000, 0.00, 5.00),
  (5, NULL, 5, 'Parque Principal de Santuario', 'Punto histórico de encuentro, eventos e interés cultural frente a la alcaldía.', 'Calle 6 # 4-15', 5.07440000, -75.96390000, 0.00, 4.70),
  (6, 4, 5, 'Hotel Santuario Plaza', 'Alojamiento confort con estilo colonial frente a la plaza principal.', 'Carrera 5 # 6-22', 5.07460000, -75.96400000, 90000.00, 4.60);

-- 5. Menú / Platos
INSERT INTO menu_platos (id, establecimiento_id, nombre_plato, descripcion, precio, alergenos, disponible) VALUES
  (1, 1, 'Bandeja Paisa Tradicional', 'Incluye frijoles, chicharrón, carne molida, huevo, plátano y arepa.', 30000.00, 'Ninguno', TRUE),
  (2, 1, 'Sopa de Sancocho Trifásico', 'Acompañado de arroz y ensalada.', 18000.00, NULL, TRUE),
  (3, 1, 'Trucha a la Plancha', 'Servida con patacón y ensalada fresca.', 26000.00, 'Pescado', TRUE),
  (4, 1, 'Mondongo Santuareño', 'Sopa tradicional de callo con verdura y aguacate.', 20000.00, NULL, TRUE),
  (5, 1, 'Lomo de Cerdo en Salsa de Mora', 'Acompañado de papa criolla frita.', 27000.00, NULL, TRUE),
  (6, 2, 'Espresso de Origen', 'Extracción de café con notas de chocolate y caramelo.', 5000.00, NULL, TRUE),
  (7, 2, 'Cappuccino Cremoso', 'Con leche vaporizada y canela.', 7500.00, 'Lácteos', TRUE),
  (8, 2, 'Torta Artesanal de Café', 'Acompañada de helado de vainilla.', 8500.00, 'Lácteos, gluten', TRUE),
  (9, 2, 'Granizado de Café Especial', 'Bebida fría refrescante con crema batida.', 9000.00, 'Lácteos', TRUE),
  (10, 2, 'Cold Brew Artesanal', 'Infusión en frío durante 18 horas.', 8000.00, NULL, TRUE),
  (11, 2, 'Waffle con Frutos Rojos', 'Waffle crujiente con miel orgánica.', 12000.00, 'Lácteos, gluten', TRUE),
  (12, 3, 'Pan de Bono Tradicional', 'Recién horneado con queso campesino.', 2500.00, 'Lácteos, gluten', TRUE),
  (13, 3, 'Fiambre Santuareño', 'Plato típico envuelto en hoja de plátano con pollo, cerdo y huevo.', 22000.00, NULL, TRUE),
  (14, 3, 'Sudado de Muchacho', 'Carne tierna en salsa criolla con yuca y papa.', 24000.00, NULL, TRUE),
  (15, 3, 'Caldo de Costilla', 'Ideal para el desayuno con arepa de chócolo.', 14000.00, NULL, TRUE),
  (16, 3, 'Arepa con Todo', 'Queso, carne desmechada, pollo y chicharrón.', 16000.00, 'Lácteos', TRUE),
  (17, 3, 'Chorizo Santuareño Artesanal', 'Servido con arepa y limón.', 9000.00, NULL, TRUE),
  (18, 6, 'Desayuno Campesino', 'Huevos al gusto, arepa con queso, chocolate caliente y fruta.', 15000.00, 'Lácteos', TRUE),
  (19, 6, 'Cena Gourmet Colonial', 'Corte de carne madurada con ensalada de la casa.', 45000.00, NULL, TRUE),
  (20, 6, 'Coctel de Bienvenida Tatamá', 'Bebida artesanal a base de licor local y frutas.', 18000.00, NULL, TRUE),
  (21, 1, 'Churrasco 300g', 'A la parrilla con chimichurri casero.', 35000.00, NULL, TRUE),
  (22, 1, 'Pechuga a la Plancha', 'Acompañada de papas a la francesa.', 22000.00, NULL, TRUE),
  (23, 2, 'Latte Macchiato', 'Capas de leche caliente, espresso y espuma.', 8000.00, 'Lácteos', TRUE),
  (24, 2, 'Cheesecake de Maracuyá', 'Postre artesanal frío.', 9500.00, 'Lácteos, gluten', TRUE),
  (25, 3, 'Ajiaco Santafereño', 'Con pollo, mazorca, crema de leche y alcaparras.', 23000.00, 'Lácteos', TRUE),
  (26, 3, 'Sobrebarruga en Salsa', 'Acompañada de arroz y plátano maduro.', 26000.00, NULL, TRUE),
  (27, 6, 'Noche Romántica - Vino & Quesos', 'Tabla de quesos madurados y botella de vino.', 85000.00, 'Lácteos', TRUE),
  (28, 2, 'Té Verde con Jengibre y Limón', 'Bebida caliente digestiva.', 6000.00, NULL, TRUE),
  (29, 1, 'Costillas BBQ', 'Bañadas en salsa dulce de la casa.', 32000.00, NULL, TRUE),
  (30, 3, 'Picada Familiar para 4', 'Chorizo, chicharrón, carne, papa criolla y arepitas.', 65000.00, NULL, TRUE),
  (31, 2, 'Muffin de Arándanos', 'Horneado diariamente.', 6500.00, 'Lácteos, gluten', TRUE);

-- 6. Relación Establecimientos - Etiquetas
INSERT INTO establecimiento_etiquetas (establecimiento_id, etiqueta_id) VALUES
  (1, 1), (1, 3),
  (2, 2), (2, 3),
  (3, 1), (3, 3),
  (4, 5), (4, 6),
  (5, 5), (5, 6),
  (6, 3);

-- 7. Reseñas
INSERT INTO resenas (usuario_id, establecimiento_id, calificacion, comentario, fecha) VALUES
  (3, 1, 5, '¡La bandeja paisa es espectacular! La atención súper cordial.', '2026-09-20 12:30:00'),
  (5, 1, 4, 'Excelente sazón santuareña, porciones muy generosas.', '2026-09-22 14:15:00'),
  (6, 1, 5, 'El mejor lugar para almorzar en familia en Santuario.', '2026-09-25 13:00:00'),
  (7, 1, 4, 'Muy buena comida, aunque tardó un poco por la demanda.', '2026-09-29 13:40:00'),
  (8, 1, 5, 'La trucha a la plancha es imperdible, fresca y deliciosa.', '2026-10-02 12:10:00'),
  (3, 2, 5, 'El café de origen tiene un aroma exquisito.', '2026-09-25 16:00:00'),
  (5, 2, 5, 'Los helados artesanales y el cappuccino son imperdibles.', '2026-09-28 17:20:00'),
  (6, 2, 4, 'Un lugar súper acogedor para trabajar o conversar.', '2026-09-30 15:30:00'),
  (7, 2, 5, 'Granizado de café helado 10/10.', '2026-10-01 16:45:00'),
  (9, 2, 5, 'La torta de café combina perfecto con el espresso.', '2026-10-03 17:00:00'),
  (10, 2, 4, 'Excelente atención y cafés filtrados de alta calidad.', '2026-10-05 18:10:00'),
  (3, 4, 5, 'Una vista increíble hacia el PNN Tatamá.', '2026-10-01 18:00:00'),
  (5, 4, 5, 'Ideal para ver el atardecer, aire puro total.', '2026-10-02 17:45:00'),
  (8, 4, 5, 'El punto más fotogénico del municipio.', '2026-10-04 18:15:00'),
  (10, 4, 5, 'Experiencia mágica e imperdible si visitas el pueblo.', '2026-10-06 17:30:00'),
  (5, 5, 4, 'Un parque muy bonito, limpio y de arquitectura tradicional.', '2026-10-02 10:30:00'),
  (6, 5, 5, 'Tranquilidad colonial, la plaza es hermosa.', '2026-10-03 11:15:00'),
  (7, 5, 4, 'Lugar ideal para empezar el recorrido por el municipio.', '2026-10-05 09:40:00'),
  (3, 3, 4, 'El fiambre santuareño envuelto en hoja tiene increíble sabor.', '2026-09-21 12:00:00'),
  (6, 3, 5, 'Atención rápida y sazón casera excelente.', '2026-09-26 13:20:00'),
  (8, 3, 4, 'Sancocho delicioso y choricitos criollos recomendados.', '2026-09-28 12:50:00'),
  (9, 3, 5, 'Platos bien servidos a precios bastante justos.', '2026-10-01 13:10:00'),
  (10, 3, 4, 'Buena sazón tradicional andina.', '2026-10-04 14:00:00'),
  (3, 6, 5, 'El Hotel Santuario Plaza conserva un estilo colonial hermoso.', '2026-09-15 20:00:00'),
  (5, 6, 4, 'Habitaciones muy cómodas frente al parque.', '2026-09-20 21:30:00'),
  (7, 6, 5, 'El desayuno campesino del hotel es delicioso.', '2026-09-27 08:30:00'),
  (8, 6, 4, 'Muy buen servicio y ubicación inmejorable.', '2026-10-02 19:10:00'),
  (9, 6, 5, 'La atención del personal fue muy atenta.', '2026-10-05 22:00:00'),
  (4, 1, 5, 'Sazón de primera en pleno centro.', '2026-10-06 13:15:00'),
  (4, 2, 5, 'Ambiente de café de especialidad único.', '2026-10-07 16:20:00');

-- 8. Reservas
INSERT INTO reservas (usuario_id, establecimiento_id, fecha_reserva, personas, estado) VALUES
  (3, 1, '2026-10-10 13:00:00', 4, 'CONFIRMADA'),
  (5, 2, '2026-10-12 16:30:00', 2, 'PENDIENTE'),
  (3, 6, '2026-10-18 15:00:00', 2, 'CONFIRMADA'),
  (5, 1, '2026-09-28 12:30:00', 3, 'COMPLETADA'),
  (6, 1, '2026-10-01 13:30:00', 5, 'COMPLETADA'),
  (7, 1, '2026-10-03 12:00:00', 2, 'CANCELADA'),
  (8, 1, '2026-10-11 14:00:00', 6, 'CONFIRMADA'),
  (9, 1, '2026-10-15 13:00:00', 2, 'PENDIENTE'),
  (10, 1, '2026-10-20 12:30:00', 4, 'PENDIENTE'),
  (6, 2, '2026-09-30 16:00:00', 2, 'COMPLETADA'),
  (7, 2, '2026-10-02 17:00:00', 3, 'COMPLETADA'),
  (8, 2, '2026-10-05 15:30:00', 4, 'COMPLETADA'),
  (9, 2, '2026-10-13 16:00:00', 2, 'CONFIRMADA'),
  (10, 2, '2026-10-14 17:30:00', 2, 'PENDIENTE'),
  (3, 3, '2026-09-25 12:30:00', 3, 'COMPLETADA'),
  (6, 3, '2026-10-02 13:00:00', 4, 'COMPLETADA'),
  (7, 3, '2026-10-04 12:00:00', 2, 'CANCELADA'),
  (8, 3, '2026-10-12 13:30:00', 5, 'CONFIRMADA'),
  (9, 3, '2026-10-16 12:30:00', 2, 'PENDIENTE'),
  (5, 6, '2026-09-20 14:00:00', 2, 'COMPLETADA'),
  (6, 6, '2026-10-05 15:00:00', 1, 'COMPLETADA'),
  (7, 6, '2026-10-14 18:00:00', 2, 'CONFIRMADA'),
  (8, 6, '2026-10-22 12:00:00', 3, 'PENDIENTE'),
  (9, 6, '2026-10-25 20:00:00', 2, 'PENDIENTE'),
  (10, 6, '2026-10-30 19:00:00', 4, 'PENDIENTE'),
  (3, 1, '2026-09-15 13:00:00', 2, 'COMPLETADA'),
  (5, 3, '2026-09-18 12:30:00', 4, 'COMPLETADA'),
  (6, 1, '2026-09-22 14:00:00', 3, 'COMPLETADA'),
  (7, 2, '2026-09-24 16:00:00', 2, 'COMPLETADA'),
  (8, 6, '2026-09-26 15:00:00', 2, 'CANCELADA'),
  (9, 1, '2026-09-29 13:00:00', 5, 'COMPLETADA'),
  (10, 3, '2026-10-08 12:30:00', 3, 'CONFIRMADA');

-- 9. Rutas Turísticas / Gastronómicas
INSERT INTO rutas (id, usuario_id, nombre, descripcion, token_publico, es_publica, fecha_creacion) VALUES
  (1, 3, 'Ruta del Café y la Vista Tatamá', 'Un recorrido perfecto para disfrutar del café de alta montaña y cerrar con el atardecer en el mirador.', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', TRUE, '2026-10-01 10:00:00'),
  (2, 5, 'Sabores Tradicionales de Santuario', 'Recorrido gastronómico enfocado en los platos típicos y la sazón local del municipio.', 'f6e5d4c3-b2a1-0987-6543-21fedcba0987', TRUE, '2026-10-02 11:30:00');

-- 10. Paradas de Rutas
INSERT INTO ruta_paradas (ruta_id, establecimiento_id, orden, nota) VALUES
  (1, 5, 1, 'Punto de encuentro en el Parque Principal'),
  (1, 2, 2, 'Tarde de café especial y repostería en Ancestral Café'),
  (1, 4, 3, 'Fotografías y vista panorámica al PNN Tatamá'),
  (2, 1, 1, 'Almuerzo típico con bandeja paisa en El Deleite'),
  (2, 3, 2, 'Prueba de fiambre tradicional en Restaurante Tatamá');

-- 11. Auditoría
INSERT INTO auditoria (usuario_id, accion, entidad, entidad_id, fecha) VALUES
  (3, 'INICIO_SESION', 'usuarios', 3, '2026-10-01 09:15:00'),
  (3, 'CREAR_RESERVA', 'reservas', 1, '2026-10-01 09:20:00'),
  (5, 'PUBLICAR_RESENA', 'resenas', 2, '2026-10-02 14:10:00'),
  (3, 'CREAR_RUTA', 'rutas', 1, '2026-10-03 11:00:00'),
  (1, 'ACTUALIZAR_ESTABLECIMIENTO', 'establecimientos', 1, '2026-10-04 16:45:00'),
  (6, 'INICIO_SESION', 'usuarios', 6, '2026-10-01 10:00:00'),
  (6, 'CREAR_RESERVA', 'reservas', 5, '2026-10-01 10:05:00'),
  (7, 'INICIO_SESION', 'usuarios', 7, '2026-10-01 11:30:00'),
  (7, 'CANCELAR_RESERVA', 'reservas', 6, '2026-10-01 11:45:00'),
  (8, 'INICIO_SESION', 'usuarios', 8, '2026-10-02 08:20:00'),
  (8, 'CREAR_RESERVA', 'reservas', 7, '2026-10-02 08:30:00'),
  (8, 'PUBLICAR_RESENA', 'resenas', 5, '2026-10-02 12:15:00'),
  (9, 'INICIO_SESION', 'usuarios', 9, '2026-10-03 14:00:00'),
  (9, 'PUBLICAR_RESENA', 'resenas', 10, '2026-10-03 17:05:00'),
  (10, 'INICIO_SESION', 'usuarios', 10, '2026-10-04 09:10:00'),
  (10, 'CREAR_RESERVA', 'reservas', 9, '2026-10-04 09:25:00'),
  (10, 'PUBLICAR_RESENA', 'resenas', 11, '2026-10-05 18:15:00'),
  (2, 'INICIO_SESION', 'usuarios', 2, '2026-10-05 08:00:00'),
  (2, 'ACTUALIZAR_MENU', 'menu_platos', 1, '2026-10-05 08:30:00'),
  (4, 'INICIO_SESION', 'usuarios', 4, '2026-10-05 10:15:00'),
  (4, 'ACTUALIZAR_ESTABLECIMIENTO', 'establecimientos', 6, '2026-10-05 10:45:00'),
  (3, 'INICIO_SESION', 'usuarios', 3, '2026-10-06 12:00:00'),
  (3, 'CREAR_RESERVA', 'reservas', 26, '2026-10-06 12:15:00'),
  (5, 'INICIO_SESION', 'usuarios', 5, '2026-10-06 15:30:00'),
  (6, 'PUBLICAR_RESENA', 'resenas', 17, '2026-10-06 16:00:00'),
  (7, 'CREAR_RESERVA', 'reservas', 22, '2026-10-07 09:00:00'),
  (8, 'CREAR_RESERVA', 'reservas', 23, '2026-10-07 11:20:00'),
  (9, 'CREAR_RESERVA', 'reservas', 24, '2026-10-07 14:10:00'),
  (10, 'CREAR_RESERVA', 'reservas', 25, '2026-10-07 17:00:00'),
  (1, 'AUDITORIA_SISTEMA', 'sistema', 0, '2026-10-08 00:00:00');

-- 12. REAJUSTE DE SECUENCIAS
SELECT setval(pg_get_serial_sequence('usuarios', 'id'), COALESCE(MAX(id), 1)) FROM usuarios;
SELECT setval(pg_get_serial_sequence('categorias', 'id'), COALESCE(MAX(id), 1)) FROM categorias;
SELECT setval(pg_get_serial_sequence('establecimientos', 'id'), COALESCE(MAX(id), 1)) FROM establecimientos;
SELECT setval(pg_get_serial_sequence('menu_platos', 'id'), COALESCE(MAX(id), 1)) FROM menu_platos;
SELECT setval(pg_get_serial_sequence('resenas', 'id'), COALESCE(MAX(id), 1)) FROM resenas;
SELECT setval(pg_get_serial_sequence('reservas', 'id'), COALESCE(MAX(id), 1)) FROM reservas;
SELECT setval(pg_get_serial_sequence('rutas', 'id'), COALESCE(MAX(id), 1)) FROM rutas;
SELECT setval(pg_get_serial_sequence('ruta_paradas', 'id'), COALESCE(MAX(id), 1)) FROM ruta_paradas;
SELECT setval(pg_get_serial_sequence('etiquetas', 'id'), COALESCE(MAX(id), 1)) FROM etiquetas;
SELECT setval(pg_get_serial_sequence('auditoria', 'id'), COALESCE(MAX(id), 1)) FROM auditoria;