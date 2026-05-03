import { z } from 'zod';

// Mensajes genéricos para mantener consistencia
const REQUIRED_ERROR = 'Este campo es obligatorio';
const EMAIL_ERROR = 'El formato del correo no es válido';
const MIN_LENGTH_ERROR = 'La contraseña debe tener al menos 6 caracteres';

export const loginSchema = z.object({
  correo: z
    .string(REQUIRED_ERROR)
    .min(1, REQUIRED_ERROR)
    .email(EMAIL_ERROR)
    .trim()
    .toLowerCase(),
  contrasena: z
    .string(REQUIRED_ERROR)
    .min(6, MIN_LENGTH_ERROR)
    .trim(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;