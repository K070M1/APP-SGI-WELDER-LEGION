import { useCallback, useState } from 'react';

import { productService } from '@/api/product/product.service';
import type { ProductListItem } from '@/dtos/products/product.dto';
import type { ProductFilters } from '@/dtos/products/product.filters.dto';

interface UseProductListOptions {
  onError?: (message: string) => void;
}

export function useProductList(
  options?: UseProductListOptions
) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [notFoundMessage, setNotFoundMessage] =
    useState<string | null>(null);

  const search = useCallback(
    async (filters: ProductFilters) => {
      setLoading(true);
      setNotFoundMessage(null);

      try {
        const response =
          await productService.getProducts(filters);

        if (!response.isOk()) {
          setProducts([]);
          setTotal(0);

          if (
            response.isNoData &&
            response.isNoData()
          ) {
            setNotFoundMessage(
              response.getMessage() ||
                'No se encontraron productos.'
            );
          } else {
            options?.onError?.(
              response.getMessage() ||
                'Error al cargar productos.'
            );
          }

          return;
        }

        if (
          response.isNoData &&
          response.isNoData()
        ) {
          setProducts([]);
          setTotal(0);

          setNotFoundMessage(
            response.getMessage() ||
              'No se encontraron productos.'
          );

          return;
        }

        setProducts(response.data ?? []);
        setTotal(response.total ?? 0);
      } catch {
        setProducts([]);
        setTotal(0);

        options?.onError?.(
          'Error al cargar productos.'
        );
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return {
    products,
    total,
    loading,
    notFoundMessage,
    search,
    setProducts,
  };
}