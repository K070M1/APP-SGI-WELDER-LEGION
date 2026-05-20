import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ChevronDown, Search, Package } from 'lucide-react-native';
import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import type { MovementSelectableProduct } from '../../schema';

const MOCK_PRODUCTS: MovementSelectableProduct[] = [
  { id_producto: 'p1', nombre: 'Electrodo 6011', codigo: 'E6011', precio: 15.5, stock: 35 },
  { id_producto: 'p2', nombre: 'Máscara Fotosensible', codigo: 'MF-01', precio: 120.0, stock: 10 },
  { id_producto: 'p3', nombre: 'Cable de Soldadura 2.5mm', codigo: 'CSD-25', precio: 45.0, stock: 18 },
];

export function ProductSelector({ onSelect }: { onSelect: (product: MovementSelectableProduct) => void }) {
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(
    () => MOCK_PRODUCTS.filter((product) =>
      product.nombre.toLowerCase().includes(query.toLowerCase()) ||
      product.codigo.toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  );

  return (
    <View className="mb-4">
      <Text className="text-xs font-bold text-[#333333] mb-2">PRODUCTOS</Text>
      <Popover>
        <PopoverTrigger asChild>
          <TouchableOpacity className="w-full h-12 px-4 bg-background-secondary border border-border rounded-2xl flex-row items-center gap-3 shadow-sm">
            <Text className="text-muted flex-1">Seleccione un producto</Text>
            <Icon as={ChevronDown} size={18} className="text-muted" />
          </TouchableOpacity>
        </PopoverTrigger>
        <PopoverContent className="w-[93%] bg-white border border-border px-4 py-3 rounded-3xl shadow-lg">
          <View className="mb-3">
            <View className="flex-row items-center bg-background-secondary rounded-2xl px-3 py-2 border border-border">
              <Icon as={Search} size={16} className="text-muted mr-2" />
              <TextInput
                placeholder="Buscar por nombre o código"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-sm text-foreground py-2"
                value={query}
                onChangeText={setQuery}
              />
            </View>
          </View>
          <ScrollView className="max-h-60">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prod) => (
                <TouchableOpacity
                  key={prod.id_producto}
                  className="p-3 rounded-2xl mb-2 bg-background-secondary active:bg-background-tertiary"
                  onPress={() => onSelect(prod)}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                      <Icon as={Package} size={16} className="text-primary" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-foreground text-sm">{prod.nombre}</Text>
                      <Text className="text-xs text-muted">{prod.codigo} • S/ {prod.precio}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="p-4 rounded-2xl bg-background-tertiary">
                <Text className="text-sm text-muted">No se encontró ningún producto.</Text>
              </View>
            )}
          </ScrollView>
        </PopoverContent>
      </Popover>
    </View>
  );
}