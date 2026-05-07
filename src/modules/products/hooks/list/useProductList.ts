import { useCallback, useState } from 'react';
import { productService } from '@/api/product/product.service';
import type { ProductListItem } from '@/dtos/products/product.dto';
import type { ProductFilters } from '@/dtos/products/product.filters.dto';

export function useProductList(options?: { onError?: (message: string) => void }) {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState<string | null>(null);

  const search = useCallback(async (filters: ProductFilters) => {
    setLoading(true);
    setNotFoundMessage(null);

    try {
      const response = await productService.getProducts(filters);

      if (!response.isOk()) {
        setProducts([]);
        setTotal(0);

        if (response.isNoData && response.isNoData()) {
          setNotFoundMessage(response.getMessage());
        } else {
          options?.onError?.(response.getMessage() || 'Error al cargar productos');
        }

        return;
      }

      setProducts(response.data ?? []);
      setTotal(response.total ?? 0);
    } catch (error) {
      console.error('useProductList search error:', error);
      options?.onError?.('Error al cargar productos');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [options]);

  return {
    products,
    total,
    loading,
    notFoundMessage,
    search,
    setProducts,
  };
}
