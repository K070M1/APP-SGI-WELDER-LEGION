export type MovementDetailCreateDto = {
  id_producto: string;
  cantidad: number;
  observaciones?: string | null;
};

export type MovementCreateDto = {
  tipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  observaciones?: string | null;
  id_estado: number;
  detalles: MovementDetailCreateDto[];
};