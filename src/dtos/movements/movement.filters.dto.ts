import type { Paginator } from "@/dtos/core/filters.dto";

export type MovementFilters = Paginator & {
  buscar?: string;
  tipo?: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  id_estado?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
};