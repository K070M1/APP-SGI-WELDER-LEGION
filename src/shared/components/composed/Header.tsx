import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';

interface HeaderProps {
  userName?: string;
  initials?: string;
}

export function Header({ userName = 'admin', initials = 'AD' }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      // Padding top dinámico para que no choque con la cámara / batería del celular
      style={{ paddingTop: insets.top + 10 }}
      className="px-4 pb-4 bg-[#F8FAFC] flex-row justify-end items-center"
    >
      <View className="mr-3 items-end">
        <Text className="text-[10px] text-muted-foreground uppercase tracking-widest">
          Bienvenido,
        </Text>
        <Text className="text-base font-bold text-[#333333]">
          {userName}
        </Text>
      </View>

      {/* Avatar usando los componentes de tu librería */}
      <Avatar alt="Avatar del usuario" className="w-10 h-10 border border-[#E8E8E8]">
        <AvatarFallback className="bg-[#748FFC]/10">
          <Text className="text-[#748FFC] font-bold">{initials}</Text>
        </AvatarFallback>
      </Avatar>
    </View>
  );
}