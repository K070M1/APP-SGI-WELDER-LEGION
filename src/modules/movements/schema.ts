import * as z from 'zod';

export const movementItemSchema = z.object({
  id_producto: z.string(),
  nombre: z.string(),
  codigo: z.string(),
  cantidad: z.number().min(1, 'La cantidad debe ser al menos 1'),
  precio_unitario: z.number().min(0),
  stock: z.number().optional(),
});

export const movementFormSchema = z.object({
  categoria: z.enum(['ENTRADA', 'SALIDA']),
  motivo: z.string().min(1, 'El motivo es requerido'),
  entidad_relacionada: z.string().min(2, 'El nombre del cliente/proveedor es requerido'),
  items: z.array(movementItemSchema).min(1, 'Debes agregar al menos un producto'),
});

export const movementFilterSchema = z.object({
  searchQuery: z.string().default(''),
  category: z.enum(['all', 'ENTRADA', 'SALIDA']).default('all'),
  motive: z.string().default('all'),
});

export type MovementFormValues = z.infer<typeof movementFormSchema>;
export type MovementItem = z.infer<typeof movementItemSchema>;
export type MovementFilterInput = z.input<typeof movementFilterSchema>;
export type MovementFilterValues = z.infer<typeof movementFilterSchema>;

export type MovementSelectableProduct = {
  id_producto: string;
  nombre: string;
  codigo: string;
  precio: number;
  stock?: number;
};