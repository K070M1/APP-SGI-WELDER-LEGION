import { z } from 'zod';
import { isSafeString } from './isSafeString';

const DEFAULT_MESSAGES = {
  required: 'Este campo es requerido',
  max: 'Supera el límite de 255 caracteres',
  isSafe: 'Caracteres no permitidos detectados',
};

export function zodCommonString(params?: {
  required?: true;
  messages?: { required?: string; max?: string; isSafe?: string };
}): z.ZodString;
export function zodCommonString(params: {
  required: false;
  messages?: { max?: string; isSafe?: string };
}): z.ZodOptional<z.ZodString>;
export function zodCommonString({
  required = true,
  messages = {},
}: {
  required?: boolean;
  messages?: { required?: string; max?: string; isSafe?: string };
} = {}) {
  const finalMessages = { ...DEFAULT_MESSAGES, ...messages };

  const base = z
    .string()
    .refine(isSafeString, { message: finalMessages.isSafe })
    .trim()
    .max(255, finalMessages.max);

  if (required) {
    return base.min(1, finalMessages.required);
  }

  return base.optional();
}