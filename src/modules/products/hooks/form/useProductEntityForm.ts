import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productCreateSchema, type ProductCreateFormValues } from '@/modules/products/schema';

export function useProductEntityForm(defaultValues?: Partial<ProductCreateFormValues>) {
  const form = useForm<ProductCreateFormValues>({
    resolver: zodResolver(productCreateSchema) as any,
    defaultValues: {
      nombre: '',
      codigo: '',
      precio: 0,
      stock_min: 0,
      descripcion: null,
      id_marca: '',
      id_subcategoria: '',
      id_moneda: '',
      id_estado: 1,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  return {
    form,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
  };
}
