import type { Categoria, Establecimiento } from '../types';

// La URL base correcta según tu servidor Express:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const res = await fetch(`${API_URL}/categorias`);
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}`);
    }
    const json = await res.json();
    
    // Si la respuesta es directa [ ... ] o viene envuelta { status, data: [ ... ] }
    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.data)) return json.data;
    
    return [];
  } catch (err) {
    console.error('Error consultando /api/v1/categorias:', err);
    return [];
  }
};

export const getEstablecimientos = async (): Promise<Establecimiento[]> => {
  try {
    const res = await fetch(`${API_URL}/establecimientos`);
    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status}`);
    }
    const json = await res.json();

    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.data)) return json.data;

    return [];
  } catch (err) {
    console.error('Error consultando /api/v1/establecimientos:', err);
    return [];
  }
};

// Helper genérico con token (para login, reservas, etc.)
export async function api(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message ?? 'Error en la petición');
  return json;
}