import { z } from 'zod';
import { zodCommonString } from '@/shared/utils/zod/commonString';

const userBaseSchema = z.object({
  nombre_usuario: zodCommonString(),
  correo: zodCommonString().email('Correo inválido'),
  id_rol: z.string().min(1, 'Obligatorio'),
  id_estado: z.coerce.number().min(1, 'Obligatorio'),
});

export const userCreateSchema = userBaseSchema.extend({
  clave: z.string().min(6, 'Mínimo 6 caracteres'),
});

export const userUpdateSchema = userBaseSchema.extend({
  clave: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
}).partial();

export const userFilterSchema = z.object({
  buscar: z.string().optional(),
  id_rol: z.string().optional(),
  id_estado: z.string().optional(),
});

export type UserCreateFormValues = z.infer<typeof userCreateSchema>;
export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;
export type UserFilterFormValues = z.infer<typeof userFilterSchema>;