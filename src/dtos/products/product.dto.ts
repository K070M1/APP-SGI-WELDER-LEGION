import type { AuditedEntity } from "@/dtos/core/audit.dto";

export type ProductListItem = AuditedEntity & {
  id: string;
  id_producto: string;
  nombre: string;
  codigo: string;
  precio: number;
  stock: number;
  stock_min: number;
  id_estado: number;
  estado: string;
};

export type ProductDetail = ProductListItem & {
  descripcion: string | null;
  id_marca: string;
  nombre_marca: string;
  id_subcategoria: string;
  nombre_subcategoria: string;
  id_moneda: string;
  simbolo_moneda: string;
  especificaciones?: Record<string, string>;
};