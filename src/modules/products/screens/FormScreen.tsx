import React from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { ChevronLeft, MoveLeftIcon, Save } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/shared/components/ui/select';
import { useProductEntityForm } from '@/modules/products/hooks/form/useProductEntityForm';
import { useProductStateSelect } from '@/modules/products/hooks/useProductStateSelect';

import { BRAND_OPTIONS, CATEGORY_OPTIONS, CURRENCY_OPTIONS } from '@/shared/constants/constants';

type ProductFormRoute = {
  product?: Record<string, unknown>;
};

type RootStackParamList = {
  ProductForm: ProductFormRoute;
};

type ProductFormScreenRouteProp = RouteProp<RootStackParamList, 'ProductForm'>;

export function ProductFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<ProductFormScreenRouteProp>();
  const product = route.params?.product;
  const isEditing = Boolean(product);

  const defaultValues = {
    nombre: (product?.nombre as string) ?? '',
    codigo: (product?.codigo as string) ?? '',
    precio: (product?.precio as number) ?? 0,
    stock_min: (product?.stock_min as number) ?? 0,
    descripcion: (product?.descripcion as string) ?? null,
    id_marca: (product?.id_marca as string) ?? '',
    id_subcategoria: (product?.id_subcategoria as string) ?? '',
    id_moneda: (product?.id_moneda as string) ?? '',
    id_estado: (product?.id_estado as number) ?? 1,
  };

  const { form, isSubmitting } = useProductEntityForm(defaultValues);
  const { control, handleSubmit, formState: { errors } } = form;
  const statusOptions = useProductStateSelect();

  const onSubmit = (data: unknown) => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row items-center px-4 pt-4 pb-4 bg-white border-b border-[#E8E8E8]">
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

        <ScrollView
          className="flex-1 px-4 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
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

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-xs font-bold text-[#333333] mb-2">MARCA</Text>
              <Controller
                control={control}
                name="id_marca"
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange}>
                    <SelectTrigger className="rounded-xl bg-white border border-[#E8E8E8] h-12">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent align="center" sideOffset={8} className="w-full rounded-xl border-[#E8E8E8]">
                      <SelectGroup>
                        <SelectLabel>
                          <Text className="font-bold text-[#333333]">Marca</Text>
                        </SelectLabel>
                        {BRAND_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value} label={option.label}>
                            <Text>{option.label}</Text>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </View>

            <View className="flex-1">
              <Text className="text-xs font-bold text-[#333333] mb-2">SUBCATEGORÍA</Text>
              <Controller
                control={control}
                name="id_subcategoria"
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange}>
                    <SelectTrigger className="rounded-xl bg-white border border-[#E8E8E8] h-12">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent align="center" sideOffset={8} className="w-full rounded-xl border-[#E8E8E8]">
                      <SelectGroup>
                        <SelectLabel>
                          <Text className="font-bold text-[#333333]">Subcategoría</Text>
                        </SelectLabel>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value} label={option.label}>
                            <Text>{option.label}</Text>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </View>
          </View>

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-xs font-bold text-[#333333] mb-2">PRECIO</Text>
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
                    onChangeText={(text) => onChange(Number(text))}
                    value={value ? String(value) : ''}
                  />
                )}
              />
              {errors.precio && <Text className="text-[#FF8787] text-xs mt-1">{errors.precio.message as string}</Text>}
            </View>

            <View className="flex-1">
              <Text className="text-xs font-bold text-[#333333] mb-2">STOCK</Text>
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
                    onChangeText={(text) => onChange(Number(text))}
                    value={value ? String(value) : ''}
                  />
                )}
              />
              {errors.stock_min && <Text className="text-[#FF8787] text-xs mt-1">{errors.stock_min.message as string}</Text>}
            </View>
          </View>

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-xs font-bold text-[#333333] mb-2">MONEDA</Text>
              <Controller
                control={control}
                name="id_moneda"
                render={({ field: { onChange, value } }) => (
                  <Select onValueChange={onChange}>
                    <SelectTrigger className="rounded-xl bg-white border border-[#E8E8E8] h-12">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent align="center" sideOffset={8} className="w-full rounded-xl border-[#E8E8E8]">
                      <SelectGroup>
                        <SelectLabel>
                          <Text className="font-bold text-[#333333]">Moneda</Text>
                        </SelectLabel>
                        {CURRENCY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value} label={option.label}>
                            <Text>{option.label}</Text>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </View>

            <View className="flex-1">
              <Text className="text-xs font-bold text-[#333333] mb-2">ESTADO</Text>
              <Controller
                control={control}
                name="id_estado"
                render={({ field: { onChange, value } }) => (
                  <Select>
                    <SelectTrigger className="rounded-xl bg-white border border-[#E8E8E8] h-12">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent align="center" sideOffset={8} className="w-full rounded-xl border-[#E8E8E8]">
                      <SelectGroup>
                        <SelectLabel>
                          <Text className="font-bold text-[#333333]">Estado</Text>
                        </SelectLabel>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} label={option.label}>
                            <Text>{option.label}</Text>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-xs font-bold text-[#333333] mb-2">DESCRIPCIÓN</Text>
            <Controller
              control={control}
              name="descripcion"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`min-h-[100px] px-4 py-3 bg-white border rounded-xl text-[#333333] ${errors.descripcion ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}
                  placeholder="Descripción opcional"
                  placeholderTextColor="#999999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ''}
                />
              )}
            />
            {errors.descripcion && <Text className="text-[#FF8787] text-xs mt-1">{errors.descripcion.message as string}</Text>}
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
