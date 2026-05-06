import React from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, MoveLeftIcon, Save } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/shared/components/ui/select';
import { PRODUCT_STATUS_OPTIONS } from '@/shared/constants/filters';

import type { ProductListItem } from '@/dtos/products/product.dto';

const productSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  codigo: z.string().min(2, 'El código es requerido'),
  precio: z.coerce.number().min(0.1, 'El precio debe ser mayor a 0'),
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo'),
  stock_min: z.coerce.number().min(0, 'El stock mínimo no puede ser negativo'),
  id_estado: z.coerce.number(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const product: ProductListItem | undefined = route.params?.product;
  const isEditing = !!product;

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: product?.nombre ?? '',
      codigo: product?.codigo ?? '',
      precio: product?.precio ?? 0,
      stock: product?.stock ?? 0,
      stock_min: product?.stock_min ?? 0,
      id_estado: 1,
    }
  });

  const onSubmit = (data: any) => {
    console.log('Datos listos:', data);
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* CABECERA */}
        <View className="flex-row items-center px-4 pt-20 pb-4 bg-white border-b border-[#E8E8E8]">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 mr-2"
          >
            <Icon as={ChevronLeft} size={24} className="text-[#333333]" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#333333]">
            {isEditing ? 'Editar Producto' : 'Crear Producto'}
          </Text>
        </View>

        {/* CUERPO DEL FORMULARIO */}
        <ScrollView
          className="flex-1 px-4 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Nombre */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-[#333333] mb-2">NOMBRE DEL PRODUCTO</Text>
            <Controller
              control={control}
              name="nombre"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 px-4 bg-white border rounded-xl text-[#333333] ${errors.nombre ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}
                  placeholder="Ej. Electrodo Soldadura E6011"
                  placeholderTextColor="#999999"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.nombre && <Text className="text-[#FF8787] text-xs mt-1">{errors.nombre.message as string}</Text>}
          </View>

          {/* Código */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-[#333333] mb-2">CÓDIGO SKU</Text>
            <Controller
              control={control}
              name="codigo"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 px-4 bg-white border rounded-xl text-[#333333] ${errors.codigo ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}
                  placeholder="Ej. SOLD-6011"
                  placeholderTextColor="#999999"
                  autoCapitalize="characters"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.codigo && <Text className="text-[#FF8787] text-xs mt-1">{errors.codigo.message as string}</Text>}
          </View>

          {/* Precio */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-[#333333] mb-2">PRECIO (S/)</Text>
            <Controller
              control={control}
              name="precio"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 px-4 bg-white border rounded-xl text-[#333333] ${errors.precio ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}
                  placeholder="0.00"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ? String(value) : ''}
                />
              )}
            />
            {errors.precio && <Text className="text-[#FF8787] text-xs mt-1">{errors.precio.message as string}</Text>}
          </View>

          <View className="flex-row gap-4 mb-4">
            {/* Stock Actual */}
            <View className="flex-1">
              <Text className="text-xs font-bold text-[#333333] mb-2">STOCK INICIAL</Text>
              <Controller
                control={control}
                name="stock"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 px-4 bg-white border rounded-xl text-[#333333] ${errors.stock ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}
                    placeholder="0"
                    placeholderTextColor="#999999"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? String(value) : ''}
                  />
                )}
              />
              {errors.stock && <Text className="text-[#FF8787] text-xs mt-1">{errors.stock.message as string}</Text>}
            </View>

            {/* Stock Mínimo */}
            <View className="flex-1">
              <Text className="text-xs font-bold text-[#333333] mb-2">STOCK MÍNIMO</Text>
              <Controller
                control={control}
                name="stock_min"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 px-4 bg-white border rounded-xl text-[#333333] ${errors.stock_min ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}
                    placeholder="0"
                    placeholderTextColor="#999999"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? String(value) : ''}
                  />
                )}
              />
              {errors.stock_min && <Text className="text-[#FF8787] text-xs mt-1">{errors.stock_min.message as string}</Text>}
            </View>
          </View>

          {/* Estado */}
          <View className="mb-8">
            <Text className="text-xs font-bold text-[#333333] mb-2">ESTADO</Text>
            <Controller
              control={control}
              name="id_estado"
              render={({ field: { onChange, value } }) => {
                const options = PRODUCT_STATUS_OPTIONS.filter(opt => opt.value !== 'all');
                const stringValue = value === 1 ? 'active' : 'inactive';

                return (
                  <Select
                    value={{ value: stringValue, label: '' }}
                    onValueChange={(option: any) => {
                      onChange(option.value === 'active' ? 1 : 0);
                    }}
                  >
                    <SelectTrigger className="rounded-xl bg-white border border-[#E8E8E8] h-12">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent align="center" sideOffset={8} className="w-full rounded-xl border-[#E8E8E8]">
                      <SelectGroup>
                        <SelectLabel>
                          <Text className="font-bold text-[#333333]">Estado</Text>
                        </SelectLabel>
                        {options.map((option) => (
                          <SelectItem key={option.value} value={option.value} label={option.label}>
                            <Text>{option.label}</Text>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              }}
            />
          </View>

          {/* Botones de Acción */}
          <View className="flex-row gap-3 mb-6">
            <Button
              variant="outline"
              onPress={() => navigation.goBack()}
              className="flex-1 h-12 rounded-xl bg-white border border-[#E8E8E8] flex-row items-center justify-center"
            >
              <Icon as={MoveLeftIcon} size={20} className="text-[#333333] mr-2" />
              <Text className="text-[#333333] font-bold">Cancelar</Text>
            </Button>

            <Button
              onPress={handleSubmit(onSubmit)}
              className="flex-1 bg-[#748FFC] h-12 rounded-xl flex-row items-center justify-center"
            >
              <Icon as={Save} size={20} className="text-white mr-2" />
              <Text className="text-white font-bold">
                {isEditing ? 'Guardar' : 'Crear'}
              </Text>
            </Button>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}