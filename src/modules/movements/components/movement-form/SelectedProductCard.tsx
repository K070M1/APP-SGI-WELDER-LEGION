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
    <View className="bg-background-secondary p-4 rounded-3xl border border-border mb-3 shadow-sm">
      <View className="flex-row justify-between items-start gap-4 mb-3">
        <View className="flex-1">
          <Text className="font-bold text-foreground text-sm" numberOfLines={1}>{item.nombre}</Text>
          <Text className="text-xs text-muted font-medium">{item.codigo}</Text>
          <View className="mt-2 flex-row flex-wrap items-center gap-3">
            <Text className="text-xs text-muted">Precio: S/ {item.precio_unitario.toFixed(2)}</Text>
            <Text className="text-xs text-muted">Stock: {item.stock ?? 'N/A'}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onRemove(item.id_producto)}
          className="p-2 bg-destructive/10 rounded-xl"
        >
          <Icon as={Trash2} size={16} className="text-destructive" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-background p-2 rounded-2xl border border-border">
        <TouchableOpacity onPress={() => onUpdateQty(item.id_producto, item.cantidad - 1)} className="p-2 rounded-full bg-background-secondary">
          <Icon as={Minus} size={14} className="text-foreground" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="font-bold text-foreground">{item.cantidad}</Text>
        </View>
        <TouchableOpacity onPress={() => onUpdateQty(item.id_producto, item.cantidad + 1)} className="p-2 rounded-full bg-background-secondary">
          <Icon as={Plus} size={14} className="text-primary" />
        </TouchableOpacity>
      </View>
    </View>
  );
}