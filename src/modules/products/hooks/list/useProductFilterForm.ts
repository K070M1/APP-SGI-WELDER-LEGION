import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFilterSchema, type ProductFilterFormValues } from '@/modules/products/schema';

export function useProductFilterForm(onSubmit: (values: ProductFilterFormValues) => void) {
  const form = useForm<ProductFilterFormValues>({
    resolver: zodResolver(productFilterSchema),
    defaultValues: {
      buscar: '',
      id_estado: undefined,
      id_categoria: undefined,
    },
    mode: 'onChange',
  });

  const handleFilter = form.handleSubmit(onSubmit);

  return {
    form,
    handleFilter,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
  };
}
