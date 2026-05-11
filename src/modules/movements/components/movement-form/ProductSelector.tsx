import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Search, Package } from 'lucide-react-native';
import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import type { MovementSelectableProduct } from '../../schema';

const MOCK_PRODUCTS: MovementSelectableProduct[] = [
  { id_producto: 'p1', nombre: 'Electrodo 6011', codigo: 'E6011', precio: 15.5, stock: 35 },
  { id_producto: 'p2', nombre: 'Máscara Fotosensible', codigo: 'MF-01', precio: 120.0, stock: 10 },
];

export function ProductSelector({ onSelect }: { onSelect: (product: MovementSelectableProduct) => void }) {
  return (
    <View className="mb-4">
      <Text className="text-xs font-bold text-[#333333] mb-2">BUSCAR PRODUCTOS</Text>
      <Popover>
        <PopoverTrigger asChild>
          <TouchableOpacity className="h-12 px-4 bg-background-secondary border border-border rounded-xl flex-row items-center justify-between shadow-sm">
            <View className="flex-row items-center">
              <Icon as={Search} size={18} className="text-muted mr-2" />
              <Text className="text-muted">Toca para buscar...</Text>
            </View>
          </TouchableOpacity>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] bg-background-secondary border-border p-2 rounded-2xl shadow-lg">
          <ScrollView className="max-h-60">
            {MOCK_PRODUCTS.map((prod) => (
              <TouchableOpacity
                key={prod.id_producto}
                className="p-3 border-b border-background flex-row items-center active:bg-background-tertiary"
                onPress={() => onSelect(prod)}
              >
                <Icon as={Package} size={16} className="text-primary mr-3" />
                <View>
                  <Text className="font-bold text-foreground text-sm">{prod.nombre}</Text>
                  <Text className="text-xs text-muted">{prod.codigo} • S/ {prod.precio}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </PopoverContent>
      </Popover>
    </View>
  );
}