import { z } from 'zod';
import { zodCommonString } from '@/shared/utils/zod/commonString';

const productBaseSchema = z.object({
  nombre: zodCommonString(),
  codigo: zodCommonString(),
  precio: z.coerce.number().min(0, 'Precio inválido'),
  stock_min: z.coerce.number().min(0, 'Stock inválido'),
  descripcion: zodCommonString({ required: false }).nullable(),
  id_marca: z.string().min(1, 'Obligatorio'),
  id_subcategoria: z.string().min(1, 'Obligatorio'),
  id_moneda: z.string().min(1, 'Obligatorio'),
  id_estado: z.coerce.number().min(1, 'Obligatorio'),
});

export const productCreateSchema = productBaseSchema;
export const productUpdateSchema = productBaseSchema.partial();
export const productFilterSchema = z.object({
  buscar: zodCommonString({ required: false }),
  id_estado: z.string().optional(),
  id_categoria: z.string().optional(),
});

export type ProductCreateFormValues = z.infer<typeof productCreateSchema>;
export type ProductUpdateFormValues = z.infer<typeof productUpdateSchema>;
export type ProductFilterFormValues = z.infer<typeof productFilterSchema>;