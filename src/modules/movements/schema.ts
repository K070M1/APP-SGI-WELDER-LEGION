import { z } from 'zod';
import { zodCommonString } from '@/shared/utils/zod/commonString';
import { zodDateRangeRefine } from '@/shared/utils/zod/date';

export const movementFilterBaseSchema = z.object({
  buscar: zodCommonString({ required: false }),
  tipo: z.enum(['ENTRADA', 'SALIDA', 'AJUSTE']).optional(),
  id_estado: z.string().optional(),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
});

const dateRangeRefiner = zodDateRangeRefine({
  schema: movementFilterBaseSchema,
  startDateKey: 'fecha_inicio',
  endDateKey: 'fecha_fin',
  message: 'La fecha final no puede ser menor a la inicial',
  path: ['fecha_fin']
});

export const movementFilterSchema = movementFilterBaseSchema.superRefine((data, ctx) => {
  const check = dateRangeRefiner[0];
  const params = dateRangeRefiner[1]!;

  if (!check(data)) {
    ctx.addIssue({
      code: 'custom',
      message: params.message,
      path: params.path as string[]
    });
  }
});

export type MovementFilterFormValues = z.infer<typeof movementFilterSchema>;