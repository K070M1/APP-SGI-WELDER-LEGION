export type FilterOption = {
  value: string;
  label: string;
  description: string;
};

export const PRODUCT_STOCK_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Todos', description: 'Todos los niveles' },
  { value: 'with_stock', label: 'Stock Estable', description: 'Con stock disponible' },
  { value: 'low_stock', label: 'Stock crítico', description: 'Stock Bajo Crítico' },
];

export const PRODUCT_STATUS_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Todos', description: 'Todos los estados' },
  { value: 'active', label: 'Activo', description: 'Solo Activos' },
  { value: 'inactive', label: 'Inactivo', description: 'Solo Inactivos' },
];

export type MovementCategory = 'all' | 'ENTRADA' | 'SALIDA';

export const MOVEMENT_CATEGORIES: FilterOption[] = [
  { value: 'all', label: 'Todas', description: 'Todas las categorías' },
  { value: 'ENTRADA', label: 'Entradas', description: 'Solo Ingresos' },
  { value: 'SALIDA', label: 'Salidas', description: 'Solo Salidas' },
];

export const MOVEMENT_MOTIVES: Record<MovementCategory, FilterOption[]> = {
  'all': [
    { value: 'all', label: 'Todos', description: 'Todos los motivos' },
    { value: 'COMPRA', label: 'Compra', description: 'Compra a Proveedor' },
    { value: 'DEVOLUCION', label: 'Devolución', description: 'Devolución de Cliente' },
    { value: 'AJUSTE_POSITIVO', label: 'Ajuste (+)', description: 'Ajuste de Inventario Positivo' },
    { value: 'VENTA', label: 'Venta', description: 'Venta a Cliente' },
    { value: 'CONSUMO', label: 'Consumo', description: 'Consumo Interno' },
    { value: 'MERMA', label: 'Merma', description: 'Merma o Daño' },
    { value: 'AJUSTE_NEGATIVO', label: 'Ajuste (-)', description: 'Ajuste de Inventario Negativo' },
  ],
  'ENTRADA': [
    { value: 'all', label: 'Todos', description: 'Todos los motivos' },
    { value: 'COMPRA', label: 'Compra', description: 'Compra a Proveedor' },
    { value: 'DEVOLUCION', label: 'Devolución', description: 'Devolución de Cliente' },
    { value: 'AJUSTE_POSITIVO', label: 'Ajuste (+)', description: 'Ajuste de Inventario Positivo' },
  ],
  'SALIDA': [
    { value: 'all', label: 'Todos', description: 'Todos los motivos' },
    { value: 'VENTA', label: 'Venta', description: 'Venta a Cliente' },
    { value: 'CONSUMO', label: 'Consumo', description: 'Consumo Interno' },
    { value: 'MERMA', label: 'Merma', description: 'Merma o Daño' },
    { value: 'AJUSTE_NEGATIVO', label: 'Ajuste (-)', description: 'Ajuste de Inventario Negativo' },
  ]
};