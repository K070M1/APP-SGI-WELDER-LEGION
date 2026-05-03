import { z } from 'zod';
import type { SomeType } from 'zod/v4/core';

import type { InferOutput, ZodPipeOrObject } from './types';

function isValidDDMMYYYY(value: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!m) return false;
  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);
  if (!Number.isFinite(dd) || !Number.isFinite(mm) || !Number.isFinite(yyyy)) return false;
  const d = new Date(yyyy, mm - 1, dd);
  return d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd;
}

function isValidHHMM(value: string) {
  return /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(value);
}

export const parseDate = (dateString: string, _?: 'dd/MM/yyyy'): string => {
  if (!dateString) return '';
  if (!isValidDDMMYYYY(dateString)) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  const [dd, mm, yyyy] = dateString.split('/').map(Number);
  const iso = new Date(yyyy, mm - 1, dd).toISOString().slice(0, 10);
  return iso;
};

export const zodLocalDateString = <Required extends boolean>({
  required,
  message,
}: {
  required: Required;
  message?: string;
}) => {
  return z.string().superRefine((value, ctx) => {
    const v = (value ?? '').trim();
    if (!required && v === '') return;
    if (!v) {
      ctx.addIssue({ code: 'custom', message: message ?? 'Este campo es requerido' });
      return;
    }
    if (!isValidDDMMYYYY(v)) {
      ctx.addIssue({ code: 'custom', message: message ?? 'Debe ser una fecha válida' });
      return;
    }
  });
};

export const zodLocalTimeString = <Required extends boolean>({
  required,
  message,
}: {
  required: Required;
  message?: string;
}) => {
  return z.string().superRefine((value, ctx) => {
    const v = (value ?? '').trim();
    if (!required && v === '') return;
    if (!v) {
      ctx.addIssue({ code: 'custom', message: message ?? 'La hora es requerida' });
      return;
    }
    if (!isValidHHMM(v)) {
      ctx.addIssue({ code: 'custom', message: 'La hora debe tener formato HH:mm' });
      return;
    }
  });
};

export const zodLocalDateTimeString = <Required extends boolean>({
  required,
  message,
}: {
  required: Required;
  message?: string;
}) => {
  return z.string().superRefine((value, ctx) => {
    const v = (value ?? '').trim();
    if (!required && v === '') return;
    if (!v) {
      ctx.addIssue({ code: 'custom', message: message ?? 'Este campo es requerido' });
      return;
    }
    const m = /^(\d{2}\/\d{2}\/\d{4})\s(\d{2}:\d{2})$/.exec(v);
    if (!m) {
      ctx.addIssue({ code: 'custom', message: message ?? 'Debe ser una fecha y hora válida' });
      return;
    }
    if (!isValidDDMMYYYY(m[1]) || !isValidHHMM(m[2])) {
      ctx.addIssue({ code: 'custom', message: message ?? 'Debe ser una fecha y hora válida' });
      return;
    }
  });
};

export const zodDateRangeRefine = <S extends z.ZodRawShape>({
  startDateKey,
  endDateKey,
  message,
  path,
}: {
  schema: ZodPipeOrObject<S, SomeType>;
  startDateKey: keyof S;
  endDateKey: keyof S;
  message: string;
  path: (keyof S)[];
}): [
    check: (arg: InferOutput<ZodPipeOrObject<S, SomeType>>) => unknown | Promise<unknown>,
    params?: { message: string; path: (keyof S)[] },
  ] => {
  type Out = InferOutput<ZodPipeOrObject<S, SomeType>>;
  const check = (data: Out) => {
    const startDate = data[startDateKey as keyof Out];
    const endDate = data[endDateKey as keyof Out];
    if (!startDate || !endDate) return true;
    if (typeof startDate !== 'string' || typeof endDate !== 'string') return true;
    return new Date(parseDate(startDate)) <= new Date(parseDate(endDate));
  };
  return [check, { message, path }];
};

export const zodDateTimeRangeRefine = <S extends z.ZodRawShape>({
  startDateKey,
  endDateKey,
  startTimeKey,
  endTimeKey,
  message,
  path,
}: {
  schema: ZodPipeOrObject<S, SomeType>;
  startDateKey: keyof S;
  endDateKey: keyof S;
  startTimeKey: keyof S;
  endTimeKey: keyof S;
  message: string;
  path: (keyof S)[];
}): [
    check: (arg: InferOutput<ZodPipeOrObject<S, SomeType>>) => unknown | Promise<unknown>,
    params?: { message: string; path: (keyof S)[] },
  ] => {
  type Out = InferOutput<ZodPipeOrObject<S, SomeType>>;
  const check = (data: Out) => {
    const startDate = data[startDateKey as keyof Out];
    const endDate = data[endDateKey as keyof Out];
    const startTime = data[startTimeKey as keyof Out];
    const endTime = data[endTimeKey as keyof Out];
    if (!startDate || !endDate || !startTime || !endTime) return true;
    if (
      typeof startDate !== 'string' ||
      typeof endDate !== 'string' ||
      typeof startTime !== 'string' ||
      typeof endTime !== 'string'
    ) {
      return true;
    }

    const parsedStartDate = new Date(parseDate(startDate));
    const parsedEndDate = new Date(parseDate(endDate));
    if (parsedStartDate.getTime() !== parsedEndDate.getTime()) {
      return parsedStartDate <= parsedEndDate;
    }
    if (!isValidHHMM(startTime) || !isValidHHMM(endTime)) return true;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    return sh * 60 + sm <= eh * 60 + em;
  };
  return [check, { message, path }];
};

