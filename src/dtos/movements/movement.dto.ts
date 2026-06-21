import type { AuditedEntity } from "@/dtos/core/audit.dto";

export type MovementType = 'ENTRADA' | 'SALIDA' | 'AJUSTE';

export interface MovementListItemDTO {
  id: string;
  tipo: MovementType;
  observaciones: string | null;
  fechaRegistro: string;
  // Joins según diagrama
  productoNombre: string;
  productoCodigo: string;
  cantidad: number;
  usuarioNombre: string;
}

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

// Keep existing just in case other parts of the app use them, but we will focus on MovementListItemDTO
export interface MovementListItem {
  id: string;
  id_movimiento: string;
  codigo: string;
  categoria: 'ENTRADA' | 'SALIDA';
  motivo: string;
  entidad_relacionada: string;
  cantidad_items: number;
  monto_total: number;
  fecha_movimiento: string;
  usuario_creacion: string;
}

export type MovementDetail = MovementListItem & {
  observaciones: string | null;
  detalles: MovementDetailItem[];
};