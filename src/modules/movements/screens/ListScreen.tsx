import React, { useState } from 'react';
import { View, FlatList, TextInput, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, FilterIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Controller } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel, type Option } from '@/shared/components/ui/select';

import { MOVEMENT_CATEGORIES, MOVEMENT_MOTIVES } from '@/shared/constants/filters';
import { ROUTES } from '@/navigation/routes';
import { Pagination } from '@/shared/components/composed/pagination';
import type { MovementListItemDTO } from '@/dtos/movements/movement.dto';

import { useMovementList } from '../hooks/list/useMovementList';
import { useMovementListFilterForm } from '../hooks/list/useMovementListFilterForm';
import { MovementCard } from '../components/movement-list/MovementCard';

export function MovementListScreen() {
  const navigation = useNavigation<any>();

  // Extraemos toda la lógica desde nuestro Custom Hook
  const { form, values, resetFilters } = useMovementListFilterForm();
  const { movements, isLoading, pagination } = useMovementList(values);
  
  // Estado para el modal de detalles
  const [selectedMovement, setSelectedMovement] = useState<MovementListItemDTO | null>(null);

  // Los motivos disponibles dependen de la categoría seleccionada
  const availableMotives = MOVEMENT_MOTIVES[values.category] || MOVEMENT_MOTIVES['all'];

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <View className="flex-1 px-4 pt-4">

        {/* Cabecera y Título */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <View className="flex-row items-center">
              <Text className="text-3xl font-extrabold text-[#333333] leading-tight">
                MOVIMIENTOS
              </Text>
            </View>
            <Text className="text-sm text-[#999999] font-medium mt-1">
              Entradas y Salidas
            </Text>
          </View>

          <Button
            className="rounded-2xl shadow-sm px-4 flex-row items-center bg-primary"
            onPress={() => navigation.navigate(ROUTES.MOVEMENTS.FORM)}
          >
            <Icon as={Plus} className="size-5 text-white mr-2" />
            <Text className="text-white font-bold text-sm">Nuevo</Text>
          </Button>
        </View>

        {/* Contenedor de Filtros Avanzados */}
        <View className="mb-6 gap-3">

          <Controller
            control={form.control}
            name="searchQuery"
            render={({ field: { value, onChange } }) => (
              <View className="flex-row items-center bg-background-secondary border border-border rounded-xl px-4">
                <Icon as={Search} className="size-5 text-muted" />
                <TextInput
                  placeholder="Buscar código o cliente..."
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-3 text-sm text-foreground font-medium h-10"
                  value={value}
                  onChangeText={onChange}
                />
              </View>
            )}
          />

          <View className="flex-row gap-2">
            <View className="flex-1">
              <Controller
                control={form.control}
                name="category"
                render={({ field: { value, onChange } }) => {
                  const categoryOption = MOVEMENT_CATEGORIES.find(opt => opt.value === value);
                  return (
                    <Select
                      value={value ? { value, label: categoryOption?.label || value } as Option : undefined}
                      onValueChange={(option: Option | undefined) => option && onChange(option.value)}
                    >
                      <SelectTrigger className="rounded-xl bg-background-secondary border border-border h-10">
                        <SelectValue placeholder="Categoría" />
                      </SelectTrigger>
                      <SelectContent align="start" sideOffset={8} className="w-56 rounded-xl border-border">
                        <SelectGroup>
                          <SelectLabel><Text className="font-bold text-foreground">Categoría</Text></SelectLabel>
                          {MOVEMENT_CATEGORIES.map((option) => (
                            <SelectItem key={option.value} value={option.value} label={option.label}>
                              <Text>{option.description}</Text>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </View>

            <View className="flex-1">
              <Controller
                control={form.control}
                name="motive"
                render={({ field: { value, onChange } }) => {
                  const motiveOption = availableMotives.find(opt => opt.value === value);
                  return (
                    <Select
                      value={value ? { value, label: motiveOption?.label || value } as Option : undefined}
                      onValueChange={(option: Option | undefined) => option && onChange(option.value)}
                    >
                      <SelectTrigger className="rounded-xl bg-background-secondary border border-border h-10">
                        <SelectValue placeholder="Motivo" />
                      </SelectTrigger>
                      <SelectContent align="end" sideOffset={8} className="w-56 rounded-xl border-border">
                        <SelectGroup>
                          <SelectLabel><Text className="font-bold text-foreground">Motivo</Text></SelectLabel>
                          {availableMotives.map((option) => (
                            <SelectItem key={option.value} value={option.value} label={option.label}>
                              <Text>{option.description}</Text>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  );
                }}
              />
            </View>
          </View>

          <View className="flex-row gap-2 mt-1">
            <Button variant="outline" className="flex-1 rounded-xl h-10 flex-row items-center justify-center" onPress={resetFilters}>
              <Icon as={FilterIcon} className="size-4 text-foreground mr-2" />
              <Text className="text-foreground font-bold text-xs">Limpiar</Text>
            </Button>
            <Button className="flex-1 rounded-xl h-10 flex-row items-center justify-center bg-primary" onPress={form.handleSubmit(() => undefined)}>
              <Icon as={Search} className="size-4 text-primary-foreground mr-2" />
              <Text className="text-primary-foreground font-bold text-xs">Buscar</Text>
            </Button>
          </View>
        </View>

        {/* Lista de Movimientos con Paginación Inyectada */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center mt-10">
            <ActivityIndicator size="large" color="#748FFC" />
          </View>
        ) : (
          <FlatList
            data={movements}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 120 : 100, paddingHorizontal: 2 }}
            renderItem={({ item }) => (
              <MovementCard
                movement={item}
                onViewDetail={() => setSelectedMovement(item)}
              />
            )}
            ListEmptyComponent={() => (
              <View className="mt-10 items-center px-4">
                <Text className="text-base font-semibold text-[#333333] mb-2">No se encontraron Movimientos</Text>
                <Text className="text-sm text-[#6B7280] text-center">Ajusta los filtros o intenta con otro término de búsqueda.</Text>
              </View>
            )}
          />
        )}

        <View className="border-t border-slate-200 mt-5 mb-2" />

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
      
      {/* Ventana Emergente de Detalle de Movimiento */}
      {selectedMovement && (
        <View className="absolute inset-0 z-50 justify-center items-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="bg-white rounded-3xl w-full max-h-[80%] overflow-hidden shadow-lg">
            <View className="p-5 border-b border-[#E8E8E8] flex-row justify-between items-center bg-[#F8FAFC]">
              <Text className="text-lg font-bold text-[#333333]">Detalle del Movimiento</Text>
              <TouchableOpacity onPress={() => setSelectedMovement(null)}>
                <View className="w-8 h-8 rounded-full bg-[#E8E8E8] items-center justify-center">
                  <Text className="text-[#333333] font-bold">X</Text>
                </View>
              </TouchableOpacity>
            </View>
            
            <View className="p-5">
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-[#999999]">Tipo:</Text>
                <Text className="text-sm font-bold text-[#333333]">{selectedMovement.tipo}</Text>
              </View>
              {selectedMovement.cliente && (
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm text-[#999999]">Cliente/Prov:</Text>
                  <Text className="text-sm font-bold text-[#333333]">{selectedMovement.cliente}</Text>
                </View>
              )}
              {selectedMovement.motivo && (
                <View className="flex-row justify-between mb-4">
                  <Text className="text-sm text-[#999999]">Motivo:</Text>
                  <Text className="text-sm font-bold text-[#333333]">{selectedMovement.motivo}</Text>
                </View>
              )}
              
              <Text className="text-sm font-extrabold text-[#333333] mt-4 mb-3">PRODUCTOS INVOLUCRADOS</Text>
              
              <FlatList 
                data={selectedMovement.detalles}
                keyExtractor={(item) => item.id_producto}
                renderItem={({ item }) => (
                  <View className="bg-white rounded-xl p-3 mb-2 flex-row justify-between items-center border border-[#E8E8E8]">
                    <View className="flex-1">
                      <Text className="font-bold text-[#333333] text-sm">{item.codigo_producto}</Text>
                      <Text className="text-[#999999] text-xs mt-0.5" numberOfLines={1}>{item.nombre_producto}</Text>
                    </View>
                    <View className="items-end pl-2">
                      <Text className="text-[#748FFC] font-bold text-base">{item.cantidad} und</Text>
                      <Text className="text-[#999999] text-[10px] mt-0.5">
                        Stock: {item.stock_inicial ?? '-'} → {item.stock_final ?? '-'}
                      </Text>
                    </View>
                  </View>
                )}
                contentContainerClassName="pb-4"
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}