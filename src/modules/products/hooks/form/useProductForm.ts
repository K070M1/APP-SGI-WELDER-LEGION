import { useCallback, useState } from 'react';
import type { ProductDetail } from '@/dtos/products/product.dto';
import type { ProductCreateFormValues, ProductUpdateFormValues } from '@/modules/products/schema';
import { productService } from '@/api/product/product.service';

export function useProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async (id?: string): Promise<ProductDetail | null> => {
    if (!id) return null;
    setIsLoading(true);

    try {
      const response = await productService.getProductById(id);
      if (!response.isOk()) return null;
      return response.data;
    } catch (error) {
      console.error('useProductForm load error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const save = useCallback(async (values: ProductCreateFormValues | ProductUpdateFormValues, id?: string): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      if (id) {
        const response = await productService.updateProduct(id, values as ProductUpdateFormValues);
        return response.isOk();
      }

      const response = await productService.createProduct(values as ProductCreateFormValues);
      return response.isOk();
    } catch (error) {
      console.error('useProductForm save error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isLoading,
    isSubmitting,
    load,
    save,
  };
}
