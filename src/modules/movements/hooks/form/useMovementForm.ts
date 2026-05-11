import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { movementFormSchema, type MovementFormValues, type MovementItem, type MovementSelectableProduct } from '../../schema';

export function useMovementForm(initialData?: Partial<MovementFormValues>) {
  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementFormSchema),
    defaultValues: {
      categoria: 'ENTRADA',
      motivo: '',
      entidad_relacionada: '',
      items: [],
      ...initialData
    }
  });

  const { watch, setValue } = form;
  const currentCategory = watch('categoria');
  const selectedItems = watch('items') || [];

  // Al cambiar la categoría, reseteamos el motivo para mantener la lógica
  useEffect(() => {
    setValue('motivo', '');
  }, [currentCategory]);

  const addProduct = (product: MovementSelectableProduct) => {
    const exists = selectedItems.find(item => item.id_producto === product.id_producto);
    if (exists) {
      updateQuantity(product.id_producto, exists.cantidad + 1);
    } else {
      const newItem: MovementItem = {
        id_producto: product.id_producto,
        nombre: product.nombre,
        codigo: product.codigo,
        cantidad: 1,
        precio_unitario: product.precio
      };
      setValue('items', [...selectedItems, newItem]);
    }
  };

  const removeProduct = (id: string) => {
    setValue('items', selectedItems.filter(item => item.id_producto !== id));
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setValue('items', selectedItems.map(item =>
      item.id_producto === id ? { ...item, cantidad: newQty } : item
    ));
  };

  const totalMonto = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);
  }, [selectedItems]);

  return {
    form,
    currentCategory,
    selectedItems,
    totalMonto,
    addProduct,
    removeProduct,
    updateQuantity
  };
}