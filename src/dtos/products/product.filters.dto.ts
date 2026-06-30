import type { Paginator } from '@/dtos/core/filters.dto';

export type ProductStockFilter =
  | 'all'
  | 'low_stock'
  | 'with_stock';

export type ProductFilters = Paginator & {
  buscar?: string;
  id_estado?: string;
  id_categoria?: string;
  id_marca?: string;
  stock_filter?: ProductStockFilter;
};