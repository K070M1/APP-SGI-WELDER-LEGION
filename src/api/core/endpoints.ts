/**
 * Endpoints centralizados de la API
 * Define todas las rutas disponibles del backend
 */

export const ENDPOINTS = {
  // ===== PRODUCTOS =====
  PRODUCTS: '/productos',
  PRODUCTS_BY_ID: '/productos/:id',
  PRODUCTS_SELECT: '/productos/select',

  // ===== USUARIOS =====
  USERS: '/usuarios',
  USERS_BY_ID: '/usuarios/:id',
  USERS_SELECT: '/usuarios/select',

  // ===== MOVIMIENTOS =====
  MOVEMENTS: '/movimientos',
  MOVEMENTS_BY_ID: '/movimientos/:id',

  // ===== AUTENTICACIÓN =====
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_ME: '/auth/me',
} as const;

/**
 * Helper para reemplazar parámetros dinámicos en endpoints
 * Ejemplo: endpoint('/productos/:id', { id: '123' }) => '/productos/123'
 */
export function endpoint(template: string, params: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, String(value));
  }
  return result;
}
