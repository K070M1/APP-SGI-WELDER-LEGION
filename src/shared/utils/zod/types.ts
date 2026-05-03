import type { FieldValues } from 'react-hook-form';
import type { z } from 'zod';
import type { SomeType } from 'zod/v4/core';

export type ZodPipeOrObject<Shape extends z.ZodRawShape, PipeOut extends SomeType> =
  | z.ZodPipe<z.ZodObject<Shape>, PipeOut>
  | z.ZodObject<Shape>;

export type InferOutput<T> = T extends ZodPipeOrObject<infer _, infer __>
  ? T extends z.ZodObject
  ? z.infer<T> extends FieldValues
  ? z.infer<T>
  : never
  : T extends z.ZodPipe
  ? z.infer<T> extends FieldValues
  ? z.infer<T>
  : never
  : never
  : never;