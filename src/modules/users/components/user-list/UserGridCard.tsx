// src/modules/users/components/user-list/UserGridCard.tsx
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { User } from 'lucide-react-native';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import type { UserListItem } from '@/dtos/users/user.dto';

interface UserGridCardProps {
  user: UserListItem;
  onPress: () => void;
}

export function UserGridCard({ user, onPress }: UserGridCardProps) {
  const isActive = user.id_estado === 1;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-1 bg-white p-4 rounded-3xl border border-[#E8E8E8] items-center justify-between aspect-square m-1 shadow-sm"
    >
      {/* Estado Indicador Flotante Alto Superior */}
      <View className="w-full flex-row justify-end items-center h-4">
        <View className={`size-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
      </View>

      {/* Avatar Central */}
      <Avatar alt="avatar" className="size-20 rounded-circle bg-[#748FFC]/10 border border-[#748FFC]/20 flex items-center justify-center">
        <AvatarFallback>
          <Icon as={User} className="size-10 text-[#748FFC]" />
        </AvatarFallback>
      </Avatar>

      {/* Información del Usuario */}
      <View className="items-center w-full mt-2">
        <Text className="font-bold text-sm text-[#333333] text-center" numberOfLines={1}>
          {user.nombre} {user.apellido}
        </Text>
        <Text className="text-[10px] text-[#999999] font-medium mt-0.5 uppercase tracking-wider">
          {user.rol}
        </Text>
      </View>
    </TouchableOpacity>
  );
}