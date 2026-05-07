/**
 * Constantes de la aplicación - APP-SGI-WELDER-LEGION
 * Opciones de formularios, listas desplegables y datos estáticos
 */

// OPCIONES DE PRODUCTOS
export const BRAND_OPTIONS = [
  { value: 'marca-001', label: 'Lincoln Electric' },
  { value: 'marca-002', label: 'ESAB' },
  { value: 'marca-003', label: 'Miller' },
];

export const CATEGORY_OPTIONS = [
  { value: 'subcat-001', label: 'Electrodos' },
  { value: 'subcat-002', label: 'Máquinas' },
  { value: 'subcat-003', label: 'Consumibles' },
];

export const CURRENCY_OPTIONS = [
  { value: 'sol', label: 'Soles (S/)' },
  { value: 'usd', label: 'Dólares (US$)' },
];

// OPCIONES DE USUARIOS
export const USER_STATUS_OPTIONS = [
  { value: 1, label: 'Activo' },
  { value: 0, label: 'Inactivo' },
];

export const USER_ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuario' },
  { value: 'viewer', label: 'Visualizador' },
];

// OPCIONES DE MOVIMIENTOS
export const MOVEMENT_TYPE_OPTIONS = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'salida', label: 'Salida' },
  { value: 'ajuste', label: 'Ajuste' },
];

// CONSTANTES DE UI
export const PAGINATION_SIZES = [10, 25, 50, 100];

export const SORT_DIRECTIONS = [
  { value: 'asc', label: 'Ascendente' },
  { value: 'desc', label: 'Descendente' },
];

// TIPOS PARA LAS OPCIONES
export type SelectOption = {
  value: string | number;
  label: string;
};

export type StatusOption = {
  value: number;
  label: string;
};