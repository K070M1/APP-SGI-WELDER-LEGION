import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LogOutIcon, SettingsIcon } from 'lucide-react-native';
import type { TriggerRef } from '@rn-primitives/popover';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils/tw';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';

// Ya no necesitamos onNavigateSettings en las props
interface UserMenuProps {
  children: React.ReactNode; // El icono que pasaremos desde el Tab
  onSignOut?: () => void;
}

const USER = {
  fullName: 'Jomar Peralta',
  initials: 'JP',
  username: 'admin_welder',
};

export function UserMenu({ children, onSignOut }: UserMenuProps) {
  const popoverTriggerRef = React.useRef<TriggerRef>(null);
  const navigation = useNavigation<any>();

  function handleSignOut() {
    popoverTriggerRef.current?.close();
    if (onSignOut) onSignOut();
  }

  function handleSettings() {
    popoverTriggerRef.current?.close();
    navigation.navigate('Profile_Main');
  }

  return (
    <Popover>
      {/* 
        Al quitar 'asChild' y usar el className aquí, convertimos el Trigger 
        en el contenedor principal que agrupa tu icono y el texto CUENTA.
      */}
      <PopoverTrigger ref={popoverTriggerRef} className="flex-col items-center justify-center pt-2">
        {children}
        <Text className="text-[10px] font-medium text-[#8E8E93] mt-1">CUENTA</Text>
      </PopoverTrigger>

      <PopoverContent align="center" side="top" sideOffset={15} className="w-72 p-0 rounded-2xl bg-white shadow-sm border-[#E8E8E8]">
        <View className="p-4">

          {/* Cabecera del Popover: Avatar y Datos */}
          <View className="flex-row items-center gap-3">
            <Avatar alt="Avatar" className="size-10 bg-[#748FFC]/10 border border-[#748FFC]/20">
              <AvatarFallback>
                <Text className="text-[#748FFC] font-bold">{USER.initials}</Text>
              </AvatarFallback>
            </Avatar>
            <View className="flex-1">
              <Text className="font-bold leading-5 text-[#333333]">{USER.fullName}</Text>
              <Text className="text-muted-foreground text-xs font-normal leading-4">
                {USER.username}
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