import type { AuditedEntity } from "@/dtos/core/audit.dto";

export type MovementDetailItem = {
  id_detalle: string;
  id_producto: string;
  nombre_producto: string;
  codigo_producto: string;
  cantidad: number;
  stock_inicial: number;
  stock_final: number;
  observaciones: string | null;
};

export type MovementListItem = AuditedEntity & {
  id: string;
  id_movimiento: string;
  prefijo: string;
  fecha_registro: string;
  tipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  total_productos: number;
  id_estado: number;
  estado: string;
};

export type MovementDetail = MovementListItem & {
  observaciones: string | null;
  detalles: MovementDetailItem[];
};