import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/shared/components/ui/text';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/tw';
import { PackageOpen, Search, Filter, Plus, ChevronDown } from 'lucide-react-native';
import { movementService } from '@/api/movement/movement.service';
import type { MovementListItemDTO, MovementType } from '@/dtos/movements/movement.dto';
import { MovementCard } from '../components/MovementCard';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/shared/components/ui/select';
import { usePagination } from '@/shared/hooks/use-pagination';
import { Pagination } from '@/shared/components/composed/pagination';

type CategoryFilter = 'TODAS' | MovementType;

const CATEGORY_OPTIONS = [
  { value: 'TODAS', label: 'Todas' },
  { value: 'ENTRADA', label: 'Entradas' },
  { value: 'SALIDA', label: 'Salidas' },
  { value: 'AJUSTE', label: 'Ajustes' },
];

const MOTIVE_OPTIONS = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'COMPRA', label: 'Compra' },
  { value: 'VENTA', label: 'Venta' },
];

export default function MovementsListScreen() {
  const [movements, setMovements] = useState<MovementListItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState({ value: 'TODAS', label: 'Todas' });
  const [motiveFilter, setMotiveFilter] = useState({ value: 'TODOS', label: 'Todos' });
  
  // Estado para forzar la búsqueda (cuando se presiona "Buscar")
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  const pagination = usePagination(movements.length, 10);

  const fetchMovements = useCallback(async () => {
    try {
      const data = await movementService.getMovements(
        categoryFilter.value !== 'TODAS' ? { tipo: categoryFilter.value as any } : undefined
      );
      setMovements(data);
    } catch (error) {
      console.error('Failed to fetch movements', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [categoryFilter.value]);

  useEffect(() => {
    setIsLoading(true);
    fetchMovements();
  }, [fetchMovements]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchMovements();
  };

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
    // Podríamos recargar de la BD aquí si el backend soportara la búsqueda
    // fetchMovements();
  };

  const handleClear = () => {
    setSearchQuery('');
    setActiveSearchQuery('');
    setCategoryFilter({ value: 'TODAS', label: 'Todas' });
    setMotiveFilter({ value: 'TODOS', label: 'Todos' });
  };

  // Filtrado local basado en el searchQuery "activo" (después de presionar Buscar)
  const filteredMovements = useMemo(() => {
    if (!activeSearchQuery.trim()) return movements;
    const lowerQuery = activeSearchQuery.toLowerCase();
    return movements.filter(
      (m) =>
        m.productoCodigo.toLowerCase().includes(lowerQuery) ||
        m.productoNombre.toLowerCase().includes(lowerQuery)
    );
  }, [movements, activeSearchQuery]);

  const pageSizeNumber = Number(pagination.pageSize);
  const currentPageSafe = Math.min(pagination.currentPage, pagination.totalPages || 1);
  const paginatedMovements = filteredMovements.slice((currentPageSafe - 1) * pageSizeNumber, currentPageSafe * pageSizeNumber);

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="w-20 h-20 bg-muted/50 rounded-full items-center justify-center mb-4">
          <PackageOpen size={40} className="text-muted-foreground" />
        </View>
        <Text className="text-lg font-bold text-foreground">No hay movimientos</Text>
        <Text className="text-sm text-muted-foreground mt-2 text-center px-10">
          No se encontraron resultados que coincidan con los filtros seleccionados.
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background pt-12">
      {/* ... cabeceras omitidas, pero no las toco aquí, el diff de abajo preserva esto ... */}
      
      {/* Header Superior */}
      <View className="px-5 py-4 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-black text-foreground">MOVIMIENTOS</Text>
          <Text className="text-base text-muted-foreground mt-1 font-medium">Entradas y Salidas</Text>
        </View>
        <Button className="rounded-full px-5 h-11 flex-row items-center space-x-2">
          <Plus size={18} className="text-primary-foreground" />
          <Text className="text-primary-foreground font-bold text-base ml-1">Nuevo</Text>
        </Button>
      </View>

      {/* Controles de Filtros */}
      <View className="px-5 pb-5 border-b border-border">
        
        {/* Input de Búsqueda */}
        <View className="relative mb-3">
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            <Search size={20} className="text-muted-foreground" />
          </View>
          <Input
            placeholder="Buscar código o cliente..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="pl-12 h-14 rounded-2xl border-border text-base bg-background"
          />
        </View>

        {/* Dropdowns de Filtro */}
        <View className="flex-row space-x-3 mb-4">
          <View className="flex-1 mr-3">
            <Select value={categoryFilter as any} onValueChange={(opt: any) => setCategoryFilter(opt)}>
              <SelectTrigger className="h-12 rounded-2xl border-border bg-background">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent align="start" sideOffset={8} className="w-56 rounded-xl border-slate-100">
                <SelectGroup>
                  <SelectLabel>
                    <Text className="font-bold text-slate-900">CATEGORÍA</Text>
                  </SelectLabel>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                      <Text>{opt.label}</Text>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>
          
          <View className="flex-1">
            <Select value={motiveFilter as any} onValueChange={(opt: any) => setMotiveFilter(opt)}>
              <SelectTrigger className="h-12 rounded-2xl border-border bg-background">
                <SelectValue placeholder="Motivo" />
              </SelectTrigger>
              <SelectContent align="end" sideOffset={8} className="w-56 rounded-xl border-slate-100">
                <SelectGroup>
                  <SelectLabel>
                    <Text className="font-bold text-slate-900">MOTIVO</Text>
                  </SelectLabel>
                  {MOTIVE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                      <Text>{opt.label}</Text>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>
        </View>

        {/* Botones de Acción */}
        <View className="flex-row space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 h-14 rounded-2xl border-border flex-row items-center justify-center mr-3"
            onPress={handleClear}
          >
            <Filter size={18} className="text-foreground" />
            <Text className="font-bold ml-2 text-[15px]">Limpiar</Text>
          </Button>

          <Button 
            className="flex-1 h-14 rounded-2xl flex-row items-center justify-center"
            onPress={handleSearch}
          >
            <Search size={18} className="text-primary-foreground" />
            <Text className="text-primary-foreground font-bold ml-2 text-[15px]">Buscar</Text>
          </Button>
        </View>

      </View>

      {/* Listado de Tarjetas */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#748FFC" />
        </View>
      ) : (
        <>
          <FlatList
            data={paginatedMovements}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MovementCard movement={item} />}
            contentContainerClassName="p-5 flex-grow"
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            ListEmptyComponent={renderEmptyComponent}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#748FFC" />
            }
          />

          <View className="border-t border-slate-200 mt-2 mb-2" />

          <View className="pb-4">
            <Pagination
              currentPage={pagination.currentPage}
              pageSize={pagination.pageSize}
              totalRecords={pagination.totalRecords}
              pageStart={pagination.pageStart}
              pageEnd={pagination.pageEnd}
              canNextPage={pagination.canNextPage}
              canPrevPage={pagination.canPrevPage}
              onNextPage={pagination.handleNextPage}
              onPrevPage={pagination.handlePrevPage}
              onPageSizeChange={pagination.handlePageSizeChange}
            />
          </View>
        </>
      )}
    </View>
  );
}
