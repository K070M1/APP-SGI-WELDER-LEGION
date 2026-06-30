export type MovementDetailCreateDto = {
  id_producto: string;
  cantidad: number;
  stockInicial: number;
  stockFinal: number;
  observaciones?: string | null;
};

export type MovementCreateDto = {
  tipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  motivo: string | null;
  cliente: string | null;
  detalles: MovementDetailCreateDto[];
};