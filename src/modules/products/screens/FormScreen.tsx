import React, { useEffect } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
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
import { useProductForm } from '@/modules/products/hooks/form/useProductForm';
import { useUiOverlay } from '@/shared/contexts/UiOverlayContext';

import { BRAND_OPTIONS, CATEGORY_OPTIONS, CURRENCY_OPTIONS } from '@/shared/constants/constants';

type ProductFormRoute = {
  product?: Record<string, unknown>;
  id?: string;
};

type RootStackParamList = {
  ProductForm: ProductFormRoute;
};

type ProductFormScreenRouteProp = RouteProp<RootStackParamList, 'ProductForm'>;

export function ProductFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<ProductFormScreenRouteProp>();
  const productId = route.params?.id;
  const isEditing = Boolean(productId);
  const { showAlert } = useUiOverlay();

  const { form } = useProductEntityForm();
  const { control, handleSubmit, reset, formState: { errors } } = form;
  const statusOptions = useProductStateSelect();

  const { load, save, isLoading, isSubmitting } = useProductForm();

  // Cargar datos del producto si estamos editando
  useEffect(() => {
    if (isEditing && productId) {
      const fetchProductDetails = async () => {
        const data = await load(productId);
        if (data) {
          reset({
            nombre: data.nombre || '',
            codigo: data.codigo || '',
            precio: data.precio !== undefined ? data.precio : 0,
            stock_min: data.stock_min !== undefined ? data.stock_min : 0,
            descripcion: data.descripcion || null,
            id_marca: data.id_marca || '',
            id_subcategoria: data.id_subcategoria || '',
            id_moneda: data.id_moneda || '',
            id_estado: data.id_estado !== undefined ? data.id_estado : 1,
          });
        }
      };
      fetchProductDetails();
    }
  }, [productId, isEditing, load, reset]);

  const onSubmit = (data: any) => {
    const estadoTexto = data.id_estado === 1 ? 'Activo' : 'Inactivo';
    const mensaje = isEditing
      ? `¿Deseas actualizar este producto?\n\nNombre: ${data.nombre}\nCódigo: ${data.codigo}\nPrecio: S/ ${Number(data.precio).toFixed(2)}\nEstado: ${estadoTexto}`
      : `¿Deseas crear este producto?\n\nNombre: ${data.nombre}\nCódigo: ${data.codigo}\nPrecio: S/ ${Number(data.precio).toFixed(2)}\nEstado: ${estadoTexto}`;

    showAlert({
      icon: 'warning',
      title: isEditing ? 'Confirmar Actualización' : 'Confirmar Creación',
      text: mensaje,
      actions: [
        {
          name: 'CANCELAR',
          color: 'white',
          onClick: () => true,
        },
        {
          name: 'CONFIRMAR',
          color: 'blue',
          onClick: async () => {
            const success = await save(data, productId);
            if (success) {
              showAlert({
                icon: 'success',
                title: isEditing ? '¡Actualizado!' : '¡Creado!',
                text: isEditing
                  ? `El producto "${data.nombre}" se ha actualizado correctamente.`
                  : `El producto "${data.nombre}" se ha creado correctamente.`,
                actions: [
                  {
                    name: 'ACEPTAR',
                    color: 'blue',
                    onClick: () => {
                      navigation.goBack();
                      return true;
                    },
                  },
                ],
              });
            } else {
              showAlert({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al guardar el producto. Inténtalo de nuevo.',
                actions: [{ name: 'ACEPTAR', color: 'blue', onClick: () => true }],
              });
            }
            return true;
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Cabecera */}
        <View className="flex-row items-center px-4 pt-4 pb-4 bg-white border-b border-[#E8E8E8]">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 mr-2"
            disabled={isLoading || isSubmitting}
          >
            <Icon as={ChevronLeft} size={24} className="text-[#333333]" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#333333]">
            {isEditing ? 'Editar Producto' : 'Crear Producto'}
          </Text>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#748FFC" />
            <Text className="text-slate-500 font-medium mt-4">Cargando datos del producto...</Text>
          </View>
        ) : (
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

            {/* Código SKU */}
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

            {/* Marca y Subcategoría */}
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-xs font-bold text-[#333333] mb-2">MARCA</Text>
                <Controller
                  control={control}
                  name="id_marca"
                  render={({ field: { onChange, value } }) => {
                    const selectedOption = BRAND_OPTIONS.find((opt) => opt.value === value);
                    return (
                      <Select
                        value={selectedOption ? { value, label: selectedOption.label } : undefined}
                        onValueChange={(opt: any) => onChange(opt?.value)}
                      >
                        <SelectTrigger className={`rounded-xl bg-white border h-12 ${errors.id_marca ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}>
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
                    );
                  }}
                />
                {errors.id_marca && <Text className="text-[#FF8787] text-xs mt-1">{errors.id_marca.message as string}</Text>}
              </View>

              <View className="flex-1">
                <Text className="text-xs font-bold text-[#333333] mb-2">SUBCATEGORÍA</Text>
                <Controller
                  control={control}
                  name="id_subcategoria"
                  render={({ field: { onChange, value } }) => {
                    const selectedOption = CATEGORY_OPTIONS.find((opt) => opt.value === value);
                    return (
                      <Select
                        value={selectedOption ? { value, label: selectedOption.label } : undefined}
                        onValueChange={(opt: any) => onChange(opt?.value)}
                      >
                        <SelectTrigger className={`rounded-xl bg-white border h-12 ${errors.id_subcategoria ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}>
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
                    );
                  }}
                />
                {errors.id_subcategoria && <Text className="text-[#FF8787] text-xs mt-1">{errors.id_subcategoria.message as string}</Text>}
              </View>
            </View>

            {/* Precio y Stock Mínimo */}
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
                      value={value !== undefined && value !== null ? String(value) : ''}
                    />
                  )}
                />
                {errors.precio && <Text className="text-[#FF8787] text-xs mt-1">{errors.precio.message as string}</Text>}
              </View>

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
                      onChangeText={(text) => onChange(Number(text))}
                      value={value !== undefined && value !== null ? String(value) : ''}
                    />
                  )}
                />
                {errors.stock_min && <Text className="text-[#FF8787] text-xs mt-1">{errors.stock_min.message as string}</Text>}
              </View>
            </View>

            {/* Moneda y Estado */}
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-xs font-bold text-[#333333] mb-2">MONEDA</Text>
                <Controller
                  control={control}
                  name="id_moneda"
                  render={({ field: { onChange, value } }) => {
                    const selectedOption = CURRENCY_OPTIONS.find((opt) => opt.value === value);
                    return (
                      <Select
                        value={selectedOption ? { value, label: selectedOption.label } : undefined}
                        onValueChange={(opt: any) => onChange(opt?.value)}
                      >
                        <SelectTrigger className={`rounded-xl bg-white border h-12 ${errors.id_moneda ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}>
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
                    );
                  }}
                />
                {errors.id_moneda && <Text className="text-[#FF8787] text-xs mt-1">{errors.id_moneda.message as string}</Text>}
              </View>

              <View className="flex-1">
                <Text className="text-xs font-bold text-[#333333] mb-2">ESTADO</Text>
                <Controller
                  control={control}
                  name="id_estado"
                  render={({ field: { onChange, value } }) => {
                    const stringValue = value === 1 ? 'active' : 'inactive';
                    const selectedOption = statusOptions.find((opt) => opt.value === stringValue);
                    return (
                      <Select
                        value={selectedOption ? { value: stringValue, label: selectedOption.label } : undefined}
                        onValueChange={(opt: any) => onChange(opt?.value === 'active' ? 1 : 0)}
                      >
                        <SelectTrigger className={`rounded-xl bg-white border h-12 ${errors.id_estado ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}>
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
                    );
                  }}
                />
                {errors.id_estado && <Text className="text-[#FF8787] text-xs mt-1">{errors.id_estado.message as string}</Text>}
              </View>
            </View>

            {/* Descripción */}
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
                disabled={isLoading || isSubmitting}
                className="flex-1 h-12 rounded-xl bg-white border border-[#E8E8E8] flex-row items-center justify-center"
              >
                <Icon as={MoveLeftIcon} size={20} className="text-[#333333] mr-2" />
                <Text className="text-[#333333] font-bold">Cancelar</Text>
              </Button>

              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading || isSubmitting}
                className="flex-1 bg-[#748FFC] h-12 rounded-xl flex-row items-center justify-center"
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
                ) : (
                  <Icon as={Save} size={20} className="text-white mr-2" />
                )}
                <Text className="text-white font-bold">
                  {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar' : 'Crear'}
                </Text>
              </Button>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
