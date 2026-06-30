import { z } from 'zod';
import { zodCommonString } from '@/shared/utils/zod/commonString';

const productBaseSchema = z.object({
  nombre: zodCommonString()
    .regex(/^[^<>]*$/, "El nombre contiene caracteres no permitidos (XSS)")
    .regex(/^(?!.*(?:SELECT|INSERT|UPDATE|DELETE|DROP|UNION|--|;)).*$/i, "Formato no permitido (SQLi)"),
  codigo: zodCommonString()
    .regex(/^[A-Z]{4}-\d{4}$/, "Formato incorrecto (Ej. MART-1234)"),
  precio: z.coerce.number().positive('El precio no puede ser 0'),
  stock_min: z.coerce.number().min(0, 'Stock inválido'),
  descripcion: zodCommonString({ required: false }).nullable(),
  id_marca: z.string().min(1, 'Obligatorio'),
  id_subcategoria: z.string().min(1, 'Obligatorio'),
  id_moneda: z.string().min(1, 'Debe seleccionar una moneda'),
  id_estado: z.coerce.number().min(0, 'Obligatorio'),
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