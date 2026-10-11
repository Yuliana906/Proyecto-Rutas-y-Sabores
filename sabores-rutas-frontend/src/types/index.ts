export interface Categoria {
  id: number;
  nombre: string;
}

export interface Establecimiento {
  id: number;
  propietario_id?: number | null;
  categoria_id: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  precio_promedio?: number | string;
  etiquetas?: string[];
}

export interface MenuPlato {
  id: number;
  establecimiento_id: number;
  nombre_plato: string;
  descripcion?: string;
  precio: number;
  alergenos?: string | null;
}