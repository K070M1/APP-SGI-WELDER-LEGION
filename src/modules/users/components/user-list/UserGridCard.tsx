// src/modules/users/components/user-list/UserGridCard.tsx
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { User, Edit2, Trash2 } from 'lucide-react-native';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import type { UserListItem } from '@/dtos/users/user.dto';

interface UserGridCardProps {
  user: UserListItem;
  onPress: () => void;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

export function UserGridCard({ user, onPress, onEdit, onDelete }: UserGridCardProps) {
  const isActive = user.estado === 1;

  return (
    <View className="flex-1 bg-white p-4 rounded-3xl border border-[#E8E8E8] m-1 shadow-sm">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className="items-center justify-between aspect-square"
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
            {user.nombre_usuario}
          </Text>
          <Text className="text-[10px] text-[#999999] font-medium mt-0.5 uppercase tracking-wider">
            {user.rol}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botones de acción */}
      {(onEdit || onDelete) && (
        <View className="flex-row gap-2 mt-3">
          {onEdit && (
            <TouchableOpacity
              onPress={() => onEdit(user.id)}
              className="flex-1 bg-blue-500 py-2 rounded-lg flex-row items-center justify-center"
            >
              <Icon as={Edit2} size={14} className="text-white mr-1" />
              <Text className="text-white text-xs font-bold">Editar</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(user.id)}
              className="flex-1 bg-red-500 py-2 rounded-lg flex-row items-center justify-center"
            >
              <Icon as={Trash2} size={14} className="text-white mr-1" />
              <Text className="text-xs font-bold text-white">Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}