import React from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LogOutIcon, SettingsIcon } from 'lucide-react-native';
import type { TriggerRef } from '@rn-primitives/popover';
import { getAuth, signOut } from '@react-native-firebase/auth';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils/tw';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { useAuth } from '@/shared/hooks/use-auth';

interface UserMenuProps {
  children: React.ReactNode; // El icono que pasaremos desde el Tab
}

export function UserMenu({ children }: UserMenuProps) {
  const popoverTriggerRef = React.useRef<TriggerRef>(null);
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const auth = getAuth();

  // Generar iniciales del nombre
  const getInitials = (name?: string, email?: string): string => {
    if (name) {
      const names = name.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0].substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const initials = getInitials(user?.nombreUsuario, user?.email);
  const displayName = user?.nombreUsuario || user?.email?.split('@')[0] || 'Usuario';
  const username = user?.email || '';

  async function handleSignOut() {
    try {
      popoverTriggerRef.current?.close();

      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que deseas salir?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: async () => {
              try {
                // 1. Cerrar sesión en Firebase
                await signOut(auth);
                
                // 2. Limpiar el estado de Zustand
                logout();
              } catch (error: any) {
                Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta de nuevo.');
              }
            },
          },
        ]
      );
    } catch (error) {
      // Error silencioso
    }
  }

  function handleSettings() {
    popoverTriggerRef.current?.close();
    navigation.navigate('Profile_Main');
  }

  return (
    <Popover>
      <PopoverTrigger ref={popoverTriggerRef} className="flex-col items-center justify-center pt-2">
        {children}
        <Text className="text-[10px] font-medium text-[#8E8E93] mt-1">CUENTA</Text>
      </PopoverTrigger>

      <PopoverContent align="center" side="top" sideOffset={15} className="w-72 p-0 rounded-2xl bg-white shadow-sm border-[#E8E8E8]">
        <View className="p-4">

          {/* Cabecera del Popover: Avatar y Datos */}
          <View className="flex-row items-center gap-3">
            <Avatar alt="Avatar" className="size-10 bg-[#748FFC]/10 border border-[#748FFC]/20">
              {user?.perfil && (
                <AvatarImage source={{ uri: user.perfil }} />
              )}
              <AvatarFallback>
                <Text className="text-[#748FFC] font-bold">{initials}</Text>
              </AvatarFallback>
            </Avatar>
            <View className="flex-1">
              <Text className="font-bold leading-5 text-[#333333]">{displayName}</Text>
              <Text className="text-muted-foreground text-xs font-normal leading-4">
                {username}
              </Text>
            </View>
          </View>

          {/* Botones de Acción */}
          <View className="flex-row gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-[#E8E8E8] flex-row"
              onPress={handleSettings}
            >
              <Icon as={SettingsIcon} className="size-4 text-[#333333] mr-2" />
              <Text className="text-[#333333] text-xs font-bold" >Ajustes</Text>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-[#E8E8E8] flex-row bg-[#FF8787]/10"
              onPress={handleSignOut}
            >
              <Icon as={LogOutIcon} className="size-4 text-[#FF8787] mr-2" />
              <Text className="text-[#FF8787] text-xs font-bold">Salir</Text>
            </Button>
          </View>

        </View>
      </PopoverContent>
    </Popover>
  );
}