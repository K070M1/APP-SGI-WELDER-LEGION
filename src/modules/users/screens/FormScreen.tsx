import React, { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { ChevronLeft, Save, Eye, EyeOff } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/shared/components/ui/select';
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '@/shared/constants/filters';

import { useUserForm } from '../hooks/form/useUserForm';

export function UserFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const idUsuario = route.params?.id;

  const { form, isEditing, onSubmit } = useUserForm(idUsuario);

  // Estados locales para alternar la visualización de las contraseñas
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* CABECERA */}
        <View className="flex-row items-center px-4 pt-4 pb-4 bg-white border-b border-[#E8E8E8]">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
            <Icon as={ChevronLeft} size={24} className="text-[#333333]" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#333333]">
            {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
          </Text>
        </View>

        {/* CUERPO DEL FORMULARIO */}
        <ScrollView
          className="flex-1 px-4 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Nombre de Usuario */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-[#333333] mb-2">NOMBRE DE USUARIO</Text>
            <Controller
              control={form.control}
              name="nombre_usuario"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 px-4 bg-white border rounded-xl text-[#333333] ${form.formState.errors.nombre_usuario ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}
                  placeholder="Ej. jgarcia"
                  placeholderTextColor="#999999"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {form.formState.errors.nombre_usuario && (
              <Text className="text-[#FF8787] text-xs mt-1">{form.formState.errors.nombre_usuario.message as string}</Text>
            )}
          </View>

          {/* Correo Electrónico */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-[#333333] mb-2">CORREO ELECTRÓNICO</Text>
            <Controller
              control={form.control}
              name="correo"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`h-12 px-4 bg-white border rounded-xl text-[#333333] ${form.formState.errors.correo ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}
                  placeholder="Ej. usuario@welderlegion.com"
                  placeholderTextColor="#999999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {form.formState.errors.correo && (
              <Text className="text-[#FF8787] text-xs mt-1">{form.formState.errors.correo.message as string}</Text>
            )}
          </View>

          {/* Selector de Rol y Estado en una fila */}
          <View className="flex-row gap-3 mb-4">
            {/* Selector de Rol */}
            <View className="flex-1">
              <Text className="text-xs font-bold text-[#333333] mb-2">ROL DE SISTEMA</Text>
              <Controller
                control={form.control}
                name="id_rol"
                render={({ field: { onChange, value } }) => (
                  <Select value={{ value, label: value }} onValueChange={(opt: any) => onChange(opt.value)}>
                    <SelectTrigger className="rounded-xl bg-white border border-[#E8E8E8] h-12">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent align="center" sideOffset={8} className="w-full rounded-xl border-[#E8E8E8]">
                      <SelectGroup>
                        <SelectLabel><Text className="font-bold text-[#333333]">Roles</Text></SelectLabel>
                        {USER_ROLE_OPTIONS.filter(r => r.value !== 'all').map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                            <Text>{opt.label}</Text>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.id_rol && (
                <Text className="text-[#FF8787] text-xs mt-1">{form.formState.errors.id_rol.message as string}</Text>
              )}
            </View>

            {/* Selector de Estado */}
            <View className="flex-1">
              <Text className="text-xs font-bold text-[#333333] mb-2">ESTADO DE CUENTA</Text>
              <Controller
                control={form.control}
                name="id_estado"
                render={({ field: { onChange, value } }) => {
                  const stringValue = value === 1 ? 'active' : 'inactive';
                  return (
                    <Select value={{ value: stringValue, label: '' }} onValueChange={(opt: any) => onChange(opt.value === 'active' ? 1 : 0)}>
                      <SelectTrigger className="rounded-xl bg-white border border-[#E8E8E8] h-12">
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                      <SelectContent align="center" sideOffset={8} className="w-full rounded-xl border-[#E8E8E8]">
                        <SelectGroup>
                          <SelectLabel><Text className="font-bold text-[#333333]">Estados</Text></SelectLabel>
                          {USER_STATUS_OPTIONS.filter(s => s.value !== 'all').map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                              <Text>{opt.label}</Text>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {form.formState.errors.id_estado && (
                <Text className="text-[#FF8787] text-xs mt-1">{form.formState.errors.id_estado.message as string}</Text>
              )}
            </View>
          </View>

          {/* APARTADO DE CONTRASENAS (Siempre visible en creación, opcional en edición) */}
          <View className="mb-4">
            <Text className="text-xs font-bold text-[#333333] mb-2">
              CONTRASEÑA {isEditing && '(DEJAR EN BLANCO PARA NO CAMBIAR)'}
            </Text>
            <View className="relative justify-center">
              <Controller
                control={form.control}
                name="clave"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 pl-4 pr-12 bg-white border rounded-xl text-[#333333] ${form.formState.errors.clave ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}
                    placeholder="******"
                    placeholderTextColor="#999999"
                    secureTextEntry={secureText}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <TouchableOpacity
                className="absolute right-4 p-1"
                onPress={() => setSecureText(!secureText)}
              >
                <Icon as={secureText ? EyeOff : Eye} size={20} className="text-[#999999]" />
              </TouchableOpacity>
            </View>
            {form.formState.errors.clave && (
              <Text className="text-[#FF8787] text-xs mt-1">{form.formState.errors.clave.message as string}</Text>
            )}
          </View>

          {/* Confirmar Contraseña */}
          <View className="mb-6">
            <Text className="text-xs font-bold text-[#333333] mb-2">CONFIRMAR CONTRASEÑA</Text>
            <View className="relative justify-center">
              <Controller
                control={form.control}
                name="confirmar_clave"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 pl-4 pr-12 bg-white border rounded-xl text-[#333333] ${form.formState.errors.confirmar_clave ? 'border-[#FF8787]' : 'border-[#E8E8E8]'}`}
                    placeholder="******"
                    placeholderTextColor="#999999"
                    secureTextEntry={secureConfirmText}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              <TouchableOpacity
                className="absolute right-4 p-1"
                onPress={() => setSecureConfirmText(!secureConfirmText)}
              >
                <Icon as={secureConfirmText ? EyeOff : Eye} size={20} className="text-[#999999]" />
              </TouchableOpacity>
            </View>
            {form.formState.errors.confirmar_clave && (
              <Text className="text-[#FF8787] text-xs mt-1">{form.formState.errors.confirmar_clave.message as string}</Text>
            )}
          </View>

          {/* BOTONES DE ACCIÓN ASIMÉTRICOS HORIZONTALES */}
          <View className="flex-row gap-3 mb-6">
            <Button
              variant="outline"
              onPress={() => navigation.goBack()}
              className="flex-1 h-12 rounded-xl bg-white border border-[#E8E8E8] flex-row items-center justify-center"
            >
              <Text className="text-[#333333] font-bold">Cancelar</Text>
            </Button>

            <Button
              onPress={form.handleSubmit(onSubmit)}
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