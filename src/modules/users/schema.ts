// src/modules/users/schema.ts
import { z } from 'zod';
import { zodCommonString } from '@/shared/utils/zod/commonString';

// Expresión regular: Mínimo 6 caracteres, al menos 1 número, 1 minúscula, 1 mayúscula y 1 carácter especial
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_+-]).{6,}$/;

const userBaseSchema = z.object({
  nombre_usuario: zodCommonString(),
  correo: zodCommonString().email('Correo inválido'),
  id_rol: z.string().min(1, 'Obligatorio'),
  id_estado: z.coerce.number().min(0, 'Obligatorio'), // Permitir 0 (Inactivo) y 1 (Activo)
});

export const userCreateSchema = userBaseSchema.extend({
  clave: z.string()
    .min(6, 'Mínimo 6 caracteres')
    .regex(passwordRegex, 'Debe contener mayúscula, minúscula, número y carácter especial'),
  confirmar_clave: z.string().min(1, 'Obligatorio'),
}).refine((data) => data.clave === data.confirmar_clave, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmar_clave'],
});

export const userUpdateSchema = userBaseSchema.extend({
  clave: z.string()
    .min(6, 'Mínimo 6 caracteres')
    .regex(passwordRegex, 'Debe contener mayúscula, minúscula, número y carácter especial')
    .optional().or(z.literal('')),
  confirmar_clave: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.clave) {
    return data.clave === data.confirmar_clave;
  }
  return true;
}, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmar_clave'],
});

export const userFilterSchema = z.object({
  buscar: z.string().optional(),
  id_rol: z.string().optional(),
  id_estado: z.string().optional(),
});

export type UserCreateFormValues = z.infer<typeof userCreateSchema>;
export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;
export type UserFilterFormValues = z.infer<typeof userFilterSchema>;