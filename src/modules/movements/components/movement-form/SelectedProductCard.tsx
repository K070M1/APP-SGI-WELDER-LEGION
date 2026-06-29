import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import type { MovementItem } from '../../schema';

interface SelectedProductCardProps {
  item: MovementItem;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function SelectedProductCard({ item, onUpdateQty, onRemove }: SelectedProductCardProps) {
  return (
    <View className="bg-white p-4 rounded-3xl border border-[#E8E8E8] mb-3 shadow-sm">
      <View className="flex-row justify-between items-start gap-4 mb-3">
        <View className="flex-1">
          <Text className="font-bold text-[#333333] text-sm" numberOfLines={1}>{item.nombre}</Text>
          <Text className="text-xs text-[#999999] font-medium">{item.codigo}</Text>
          <View className="mt-2 flex-row flex-wrap items-center gap-3">
            <Text className="text-xs text-[#999999]">Precio: S/ {item.precio_unitario.toFixed(2)}</Text>
            <Text className="text-xs text-[#999999]">Stock: {item.stock ?? 'N/A'}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onRemove(item.id_producto)}
          className="p-2 bg-[#FFE5E5] rounded-xl"
        >
          <Icon as={Trash2} size={16} className="text-[#FF4444]" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-[#F8FAFC] p-2 rounded-2xl border border-[#E8E8E8]">
        <TouchableOpacity onPress={() => onUpdateQty(item.id_producto, item.cantidad - 1)} className="p-2 rounded-full bg-white">
          <Icon as={Minus} size={14} className="text-[#333333]" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="font-bold text-[#333333]">{item.cantidad}</Text>
        </View>
        <TouchableOpacity onPress={() => onUpdateQty(item.id_producto, item.cantidad + 1)} className="p-2 rounded-full bg-white">
          <Icon as={Plus} size={14} className="text-[#748FFC]" />
        </TouchableOpacity>
      </View>
    </View>
  );
}