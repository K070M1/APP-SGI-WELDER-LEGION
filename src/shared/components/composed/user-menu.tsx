import React from 'react';
import { View } from 'react-native';
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

// Props para inyectar las funciones desde la navegación
interface UserMenuProps {
  children: React.ReactNode; // Aquí irá el botón del Tab
  onNavigateSettings: () => void;
  onSignOut: () => void;
}

// Datos mockeados (Luego vendrán del estado global Zustand)
const USER = {
  fullName: 'Jomar Peralta',
  initials: 'JP',
  username: 'admin_welder',
};

export function UserMenu({ children, onNavigateSettings, onSignOut }: UserMenuProps) {
  const popoverTriggerRef = React.useRef<TriggerRef>(null);

  function handleSignOut() {
    popoverTriggerRef.current?.close();
    onSignOut();
  }

  function handleSettings() {
    popoverTriggerRef.current?.close();
    onNavigateSettings();
  }

  return (
    <Popover>
      {/* El trigger ahora es el "children", es decir, el botón del Tab */}
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        {children}
      </PopoverTrigger>

      {/* side="top" para que flote por encima de la barra de navegación */}
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
              <Text className="text-[#333333] text-xs font-bold">Ajustes</Text>
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