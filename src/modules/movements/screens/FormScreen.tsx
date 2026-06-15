import React, { useState } from 'react';
import { View, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Save, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Controller } from 'react-hook-form';

import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel, type Option } from '@/shared/components/ui/select';
import { MOVEMENT_CATEGORIES, MOVEMENT_MOTIVES } from '@/shared/constants/filters';
import { movementService } from '@/api/movement/movement.service';
import type { MovementCreateDto } from '@/dtos/movements/movement.create.dto';

import { useMovementForm } from '../hooks/form/useMovementForm';
import { ProductSelector } from '../components/movement-form/ProductSelector';
import { SelectedProductCard } from '../components/movement-form/SelectedProductCard';
import type { MovementFormValues } from '../schema';

export function MovementFormScreen() {
  const navigation = useNavigation();
  const { form, currentCategory, selectedItems, totalMonto, addProduct, removeProduct, updateQuantity } = useMovementForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableMotives = MOVEMENT_MOTIVES[currentCategory] || MOVEMENT_MOTIVES['all'];

  const onSubmit = async (data: MovementFormValues) => {
    try {
      setIsSubmitting(true);
      const payload: MovementCreateDto = {
        tipo: data.categoria,
        observaciones: `Motivo: ${data.motivo}. Entidad: ${data.entidad_relacionada}`,
        id_estado: 1,
        detalles: data.items.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          observaciones: null
        }))
      };

      await movementService.createMovement(payload);
      Alert.alert('Éxito', 'El movimiento se registró correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      Alert.alert('Error', 'Hubo un problema al registrar el movimiento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">

        {/* Cabecera */}
        <View className="flex-row items-center px-4 pt-4 pb-4 bg-background-secondary border-b border-border">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
            <Icon as={ChevronLeft} size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground">Nuevo Movimiento</Text>
        </View>

        <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

          {/* SECCIÓN 1: DATOS CABECERA */}
          <View className="mb-6">
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-xs font-bold text-foreground mb-2">CATEGORÍA</Text>
                <Controller
                  control={form.control}
                  name="categoria"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value ? { value, label: String(value) } as Option : undefined}
                      onValueChange={(option: Option | undefined) => option && onChange(option.value)}
                    >
                      <SelectTrigger className="rounded-xl bg-background-secondary border border-border h-12">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent align="center" sideOffset={8} className="w-48 rounded-xl border-border">
                        <SelectGroup>
                          {MOVEMENT_CATEGORIES.filter(c => c.value !== 'all').map(c => (
                            <SelectItem key={c.value} value={c.value} label={c.label}>
                              <Text>{c.label}</Text>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </View>

              <View className="flex-1">
                <Text className="text-xs font-bold text-foreground mb-2">MOTIVO</Text>
                <Controller
                  control={form.control}
                  name="motivo"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value ? ({ value, label: String(value) } as Option) : undefined}
                      onValueChange={(option: Option | undefined) => option && onChange(option.value)}
                    >
                      <SelectTrigger className="rounded-xl bg-background-secondary border border-border h-12">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent align="center" sideOffset={8} className="w-48 rounded-xl border-border">
                        <SelectGroup>
                          {availableMotives.filter(m => m.value !== 'all').map(m => (
                            <SelectItem key={m.value} value={m.value} label={m.label}>
                              <Text>{m.label}</Text>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-foreground mb-2">CLIENTE / PROVEEDOR</Text>
              <Controller
                control={form.control}
                name="entidad_relacionada"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="h-12 px-4 bg-background-secondary border border-border rounded-xl text-foreground"
                    placeholder="Nombre de la entidad..."
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>

            <View className="border-t border-[#E8E8E8] pt-2 pb-2" />

            {/* SECCIÓN 2: CARRITO DE PRODUCTOS */}
            <ProductSelector onSelect={addProduct} />

            <View className="min-h-[100px] mb-4">
              {selectedItems.length === 0 ? (
                <View className="items-center justify-center p-6 bg-background-tertiary rounded-2xl border border-dashed border-border">
                  <Text className="text-muted text-xs">No hay productos seleccionados</Text>
                </View>
              ) : (
                selectedItems.map(item => (
                  <SelectedProductCard
                    key={item.id_producto}
                    item={item}
                    onRemove={removeProduct}
                    onUpdateQty={updateQuantity}
                  />
                ))
              )}
            </View>

            {/* TOTALES */}
            <View className="bg-background p-4 rounded-2xl border border-border mb-8">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs font-bold text-muted">MONTO TOTAL ESTIMADO</Text>
                <Text className="text-xl font-extrabold text-primary">S/ {totalMonto.toFixed(2)}</Text>
              </View>
            </View>

            {/* BOTONES DE ACCIÓN */}
            <View className="flex-row gap-3">
              <Button variant="outline" onPress={() => navigation.goBack()} disabled={isSubmitting} className="flex-1 h-12 rounded-xl flex-row items-center justify-center">
                <Text className="text-foreground font-bold">Cancelar</Text>
              </Button>
              <Button onPress={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="flex-1 h-12 rounded-xl flex-row items-center justify-center shadow-sm">
                <Icon as={Save} size={18} className="text-white mr-2" />
                <Text className="text-white font-bold">{isSubmitting ? 'Registrando...' : 'Registrar'}</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}