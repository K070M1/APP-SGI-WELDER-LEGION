import React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectGroup, SelectItem, SelectLabel
} from '@/shared/components/ui/select';

interface PaginationProps {
  currentPage: number;
  pageSize: string;
  totalRecords: number;
  pageStart: number;
  pageEnd: number;
  canNextPage: boolean;
  canPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageSizeChange: (size: string) => void;
}

export function Pagination({
  currentPage,
  pageSize,
  totalRecords,
  pageStart,
  pageEnd,
  canNextPage,
  canPrevPage,
  onNextPage,
  onPrevPage,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <View className="w-full flex-col gap-4 my-2">
      {/* Contenedor Grid Principal */}
      <View className="grid grid-cols-4 flex-row justify-around w-full gap-2">

        {/* Bloque 1: Mostrar */}
        <View className="col-span-2 flex-row items-center gap-2">
          <Text className="text-sm font-medium text-slate-600">Mostrar</Text>
          <Select value={{ value: pageSize, label: pageSize }} onValueChange={(option: any) => onPageSizeChange(option.value)}>
            <SelectTrigger className="w-24 rounded-xl bg-white border border-slate-200 h-10">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent align="start" sideOffset={8} className="w-28 rounded-xl border-slate-100">
              <SelectGroup>
                <SelectLabel>
                  <Text className="font-bold text-slate-900">Registros</Text>
                </SelectLabel>
                {[10, 20, 30].map((size) => (
                  <SelectItem key={size} value={String(size)} label={String(size)}>
                    <Text>{size}</Text>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>

        {/* Bloque 2: Botones de paginación */}
        <View className="col-span-2 flex-row items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`rounded-xl h-10 px-3 flex-row items-center justify-center border-0 shadow-sm ${!canPrevPage ? 'bg-slate-50 opacity-50' : 'bg-white'}`}
            onPress={onPrevPage}
            disabled={!canPrevPage}
          >
            <Text className="text-slate-600 font-bold">&lt;</Text>
          </Button>

          <View className="rounded-xl bg-slate-100 h-10 px-4 flex-row items-center justify-center shadow-sm">
            <Text className="text-slate-900 font-bold">{String(currentPage).padStart(2, '0')}</Text>
          </View>

          <Button
            variant="outline"
            size="sm"
            className={`rounded-xl h-10 px-3 flex-row items-center justify-center border-0 shadow-sm ${!canNextPage ? 'bg-slate-50 opacity-50' : 'bg-white'}`}
            onPress={onNextPage}
            disabled={!canNextPage}
          >
            <Text className="text-slate-600 font-bold">&gt;</Text>
          </Button>
        </View>
      </View>

      {/* Bloque 3: Texto centrado abajo */}
      <View className="w-full items-center justify-center mb-2">
        <Text className="text-sm text-slate-600">
          {pageStart}-{pageEnd} de {totalRecords} registros
        </Text>
      </View>
    </View>
  );
}