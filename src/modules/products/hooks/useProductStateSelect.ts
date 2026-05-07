import { useMemo } from 'react';
import { PRODUCT_STATUS_OPTIONS } from '@/shared/constants/filters';

export function useProductStateSelect() {
  return useMemo(
    () => PRODUCT_STATUS_OPTIONS.filter((option) => option.value !== 'all'),
    []
  );
}
