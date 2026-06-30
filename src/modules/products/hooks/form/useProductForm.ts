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
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const save = useCallback(async (values: ProductCreateFormValues | ProductUpdateFormValues, id?: string): Promise<{ success: boolean, message?: string }> => {
    setIsSubmitting(true);

    try {
      if (!id) {
        // Verificar unicidad de producto por código
        const checkResponse = await productService.getProducts({ buscar: values.codigo });
        if (checkResponse.isOk() && checkResponse.data) {
          const exists = checkResponse.data.some(
            p => p.codigo.toLowerCase() === values.codigo?.toLowerCase() || p.nombre.toLowerCase() === values.nombre?.toLowerCase()
          );
          if (exists) {
            return { success: false, message: 'Ya existe un producto con este nombre o código SKU' };
          }
        }
      }

      if (id) {
        const response = await productService.updateProduct(id, values as ProductUpdateFormValues);
        return { success: response.isOk() };
      }

      const response = await productService.createProduct(values as ProductCreateFormValues);
      return { success: response.isOk() };
    } catch (error) {
      return { success: false };
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