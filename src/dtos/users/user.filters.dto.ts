import type { Paginator } from "@/dtos/core/filters.dto";

export type UserFilters = Paginator & {
  buscar?: string;
  id_rol?: string;
  id_estado?: string;
};