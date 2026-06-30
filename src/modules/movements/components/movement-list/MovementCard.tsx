import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ArrowDownRight, ArrowUpRight, Wrench, Eye } from 'lucide-react-native';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import type { MovementListItemDTO } from '@/dtos/movements/movement.dto';
import { cn } from '@/shared/utils/tw';

interface MovementCardProps {
  movement: MovementListItemDTO;
  onViewDetail: (id: string) => void;
}

export function MovementCard({ movement, onViewDetail }: MovementCardProps) {
  const isEntrada = movement.tipo === 'ENTRADA';
  const isSalida = movement.tipo === 'SALIDA';

  const title = movement.detalles?.length === 1 ? movement.detalles[0].codigo_producto : `Movimiento ${movement.id.slice(0, 8)}`;
  const subtitle = movement.cliente ? `Cliente: ${movement.cliente}` : (movement.detalles?.length === 1 ? movement.detalles[0].nombre_producto : `${movement.detalles?.length || 0} productos diferentes`);
  const totalCantidad = movement.detalles?.reduce((acc, d) => acc + (d.cantidad || 0), 0) || 0;

  const dateObj = new Date(movement.fechaRegistro);
  const formattedDate = !isNaN(dateObj.getTime()) 
    ? dateObj.toISOString().split('T')[0] 
    : movement.fechaRegistro;

  return (
    <View className="bg-white p-4 rounded-3xl border border-[#E8E8E8] shadow-sm mb-4">
      <View className="flex-row items-start gap-4 mb-3">
        {/* Ícono de Categoría */}
        <Avatar alt="avatar" className={cn(`size-14 rounded-full border border-[#E8E8E8] bg-white flex items-center justify-center shadow-sm`)}>
          <AvatarFallback className='border-none'>
            <View className={cn(`w-full h-full rounded-full flex items-center justify-center`, isEntrada ? 'bg-emerald-50' : (isSalida ? 'bg-orange-50' : 'bg-gray-50'))}>
              <Icon
                as={isEntrada ? ArrowDownRight : (isSalida ? ArrowUpRight : Wrench)}
                className={cn(`size-6`, isEntrada ? 'text-emerald-600' : (isSalida ? 'text-orange-600' : 'text-gray-600'))}
              />
            </View>
          </AvatarFallback>
        </Avatar>

        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="font-bold text-base leading-5 text-[#333333] flex-1 mr-2" numberOfLines={1}>
              {title}
            </Text>
            {/* Badge de Categoría */}
            <Badge variant="default" className={cn(`rounded-lg px-2 py-0.5 border shadow-sm`, isEntrada ? 'bg-emerald-100 border-emerald-200' : (isSalida ? 'bg-orange-100 border-orange-200' : 'bg-gray-100 border-gray-200'))}>
              <Text className={cn(`text-[10px] font-bold tracking-wider uppercase`, isEntrada ? 'text-emerald-700' : (isSalida ? 'text-orange-700' : 'text-gray-700'))}>
                {movement.tipo}
              </Text>
            </Badge>
          </View>

          <Text className="text-[#999999] text-xs font-normal leading-4 mb-1" numberOfLines={1}>
            {subtitle}
          </Text>

          <View className="flex-row justify-between items-center mt-1">
            <Text className="text-sm font-extrabold text-[#748FFC] leading-6">
              {totalCantidad} Items
            </Text>
            <Text className="text-xs font-bold text-[#333333] uppercase tracking-wider">
              {movement.motivo || movement.tipo}
            </Text>
          </View>
        </View>
      </View>

      <View className="border-t border-[#E8E8E8] my-2" />

      {/* Pie de la tarjeta */}
      <View className="flex-row justify-between items-center">
        <Text className="text-xs font-medium text-[#999999]">
          {formattedDate} • {movement.usuarioNombre}
        </Text>

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-[#E8E8E8] px-4 flex-row items-center h-9"
          onPress={() => onViewDetail(movement.id)}
        >
          <Icon as={Eye} size={14} className="text-[#333333] mr-2" />
          <Text className="text-[#333333] text-xs font-bold">Ver</Text>
        </Button>
      </View>
    </View>
  );
}