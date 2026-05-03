import type { Paginator } from "@/dtos/core/filters.dto";

export type ProductFilters = Paginator & {
  buscar?: string;
  id_estado?: string;
  id_categoria?: string;
};