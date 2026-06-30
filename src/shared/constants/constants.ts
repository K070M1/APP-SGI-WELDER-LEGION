/**
 * Constantes de la aplicación - APP-SGI-WELDER-LEGION
 * Opciones de formularios, listas desplegables y datos estáticos
 */

// OPCIONES DE PRODUCTOS
export const BRAND_OPTIONS = [
  {
    value: '84d8af01-e818-421c-ad38-a463f81d0b9f',
    label: 'ESAB',
  },
  {
    value: '9ae21271-4e88-4003-89c1-3526e506c521',
    label: 'Werken',
  },
  {
    value: 'bc84076c-cb09-4b2c-8266-b3fcb91d5f0e',
    label: 'Energy',
  },
  {
    value: '2bfd9ff2-56a5-490e-b076-44fa6e898659',
    label: 'Indura / Oerlikon',
  },
];

export const CATEGORY_OPTIONS = [
  {
    value: '06caff0c-b06e-4e49-9afb-04d3323b90a9',
    label: 'Máquinas Inverter',
  },
  {
    value: 'bc1fb813-12a2-4a6f-8220-156e47f07756',
    label: 'Máquinas multiproceso',
  },
  {
    value: '1b31630f-d107-4954-9bba-d4db8a0dfb4d',
    label: 'Electrodos Celulósicos',
  },
  {
    value: '3347ab7a-b174-4ece-bd38-fd71b8f8a686',
    label: 'Alambres',
  },
  {
    value: '8cb6c23c-777f-4e02-b3e8-1d8d368d6707',
    label: 'Fluxes',
  },
];

export const CURRENCY_OPTIONS = [
  {
    value: 'f6a68f3d-7187-44e5-acb3-dbebb7d02f40',
    label: 'Soles (S/)',
  },
  {
    value: '2116c651-8e31-4392-bd2e-2ff35acbb962',
    label: 'Dólares ($)',
  },
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