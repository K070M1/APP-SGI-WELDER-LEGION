import React from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, User, Mail, Shield, ToggleLeft, Calendar, LogOut } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '@/shared/hooks/use-auth';
import { getAuth, signOut } from '@react-native-firebase/auth';

export function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useProfile();
  const { logout } = useAuth();
  const auth = getAuth();

  const isActive = user.id_estado === 1;

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              // Cerrar sesión en Firebase
              await signOut(auth);
              // Limpiar el store de Zustand
              logout();
              console.log('✅ Sesión cerrada correctamente');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* CABECERA */}
      <View className="flex-row items-center px-4 pt-4 pb-4 bg-white border-b border-[#E8E8E8]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
          <Icon as={ChevronLeft} size={24} className="text-[#333333]" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#333333]">Mi Perfil</Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* SECCIÓN SUPERIOR: AVATAR Y ESTADO */}
        <View className="items-center mb-6 bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-sm">
          <Avatar alt="avatar" className="size-24 rounded-full bg-[#748FFC]/10 border border-[#748FFC]/20 flex items-center justify-center mb-4">
            <AvatarFallback>
              <Icon as={User} size={40} className="text-[#748FFC]" />
            </AvatarFallback>
          </Avatar>

          <Text className="text-xl font-bold text-[#333333] text-center">
            {user.nombre} {user.apellido}
          </Text>

          <Badge variant="default" className={`rounded-lg px-2.5 py-0.5 border shadow-sm mt-2 ${isActive ? 'bg-emerald-100 border-emerald-200' : 'bg-slate-100 border-slate-200'}`}>
            <Text className={`text-[10px] font-bold tracking-wider uppercase ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
              {user.estado}
            </Text>
          </Badge>
        </View>

        {/* DETALLES DE INFORMACIÓN DE SGI */}
        <View className="gap-3">

          {/* Correo Electrónico */}
          <View className="bg-white p-4 rounded-2xl border border-[#E8E8E8] flex-row items-center gap-4 shadow-sm">
            <View className="size-10 rounded-xl bg-[#F8FAFC] border border-[#E8E8E8] items-center justify-center">
              <Icon as={Mail} size={18} className="text-[#748FFC]" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-bold text-[#999999] tracking-wider uppercase">Correo Electrónico</Text>
              <Text className="text-sm font-medium text-[#333333] mt-0.5">{user.correo}</Text>
            </View>
          </View>

          {/* Rol del Sistema */}
          <View className="bg-white p-4 rounded-2xl border border-[#E8E8E8] flex-row items-center gap-4 shadow-sm">
            <View className="size-10 rounded-xl bg-[#F8FAFC] border border-[#E8E8E8] items-center justify-center">

        {/* BOTÓN DE CERRAR SESIÓN */}
        <View className="mt-8 mb-6">
          <Button
            variant="destructive"
            onPress={handleLogout}
            className="w-full rounded-2xl h-14 flex-row items-center justify-center gap-2"
          >
            <Icon as={LogOut} size={20} className="text-white" />
            <Text className="text-white font-semibold">Cerrar Sesión</Text>
          </Button>
        </View>
              <Icon as={Shield} size={18} className="text-[#748FFC]" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-bold text-[#999999] tracking-wider uppercase">Rol Asignado</Text>
              <Text className="text-sm font-bold text-[#333333] mt-0.5">{user.rol}</Text>
            </View>
          </View>

          {/* Código de Usuario */}
          <View className="bg-white p-4 rounded-2xl border border-[#E8E8E8] flex-row items-center gap-4 shadow-sm">
            <View className="size-10 rounded-xl bg-[#F8FAFC] border border-[#E8E8E8] items-center justify-center">
              <Icon as={User} size={18} className="text-[#748FFC]" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-bold text-[#999999] tracking-wider uppercase">ID de Operario</Text>
              <Text className="text-sm font-mono text-[#333333] mt-0.5">{user.id_usuario}</Text>
            </View>
          </View>

          {/* Fecha de Registro */}
          <View className="bg-white p-4 rounded-2xl border border-[#E8E8E8] flex-row items-center gap-4 shadow-sm">
            <View className="size-10 rounded-xl bg-[#F8FAFC] border border-[#E8E8E8] items-center justify-center">
              <Icon as={Calendar} size={18} className="text-[#748FFC]" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-bold text-[#999999] tracking-wider uppercase">Miembro Desde</Text>
              <Text className="text-sm font-medium text-[#333333] mt-0.5">{user.fecha_creacion}</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}