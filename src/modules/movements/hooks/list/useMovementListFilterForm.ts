import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { movementFilterSchema, type MovementFilterInput, type MovementFilterValues } from '../../schema';

export function useMovementListFilterForm(initialValues?: Partial<MovementFilterInput>) {
  const form = useForm<MovementFilterInput>({
    resolver: zodResolver(movementFilterSchema),
    defaultValues: {
      searchQuery: '',
      category: 'all',
      motive: 'all',
      ...initialValues,
    },
    mode: 'onChange',
  });

  const values = form.watch() as MovementFilterValues;

  const resetFilters = () => {
    form.reset({
      searchQuery: '',
      category: 'all',
      motive: 'all',
    });
  };

  return {
    form,
    values,
    resetFilters,
  };
}
