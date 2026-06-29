export type MovementDetailCreateDto = {
  id_producto: string;
  cantidad: number;
  stockInicial: number;
  stockFinal: number;
  observaciones?: string | null;
};

export type MovementCreateDto = {
  tipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  observaciones?: string | null;
  detalles: MovementDetailCreateDto[];
};