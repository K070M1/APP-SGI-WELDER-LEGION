import type { Paginator } from "@/dtos/core/filters.dto";

export type UserFilters = Paginator & {
  buscar?: string;
  rol?: string;
  estado?: string;
};