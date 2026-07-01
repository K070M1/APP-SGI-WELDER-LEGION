import React, { useMemo, useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ChevronDown, Search, Package } from 'lucide-react-native';
import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import type { MovementSelectableProduct } from '../../schema';
import { productService } from '@/api/product/product.service';

export function ProductSelector({ onSelect }: { onSelect: (product: MovementSelectableProduct) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<MovementSelectableProduct[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await productService.getProducts({});
        if (response.data) {
          const formatted = response.data.map((p: any) => ({
            id_producto: p.id,
            nombre: p.nombre,
            codigo: p.codigo,
            precio: p.precio || 0,
            stock: p.stock || 0
          }));
          setProducts(formatted);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(
    () => products.filter((product) =>
      product.nombre.toLowerCase().includes(query.toLowerCase()) ||
      product.codigo.toLowerCase().includes(query.toLowerCase())
    ),
    [query, products]
  );

  return (
    <View className="mb-4">
      <TouchableOpacity 
        onPress={() => setOpen(!open)}
        className="w-full h-12 px-4 bg-white border border-[#E8E8E8] rounded-xl flex-row items-center gap-3"
      >
        <Text className="text-[#999999] flex-1">Seleccione un producto</Text>
        <Icon as={ChevronDown} size={18} className="text-[#999999]" />
      </TouchableOpacity>

      {open && (
        <View className="mt-2 w-full bg-white border border-[#E8E8E8] px-4 py-3 rounded-3xl overflow-hidden">
          <View className="mb-3">
            <View className="flex-row items-center bg-white rounded-xl px-3 py-2 border border-[#E8E8E8]">
              <Icon as={Search} size={16} className="text-[#999999] mr-2" />
              <TextInput
                placeholder="Buscar por nombre o código"
                placeholderTextColor="#999999"
                className="flex-1 text-sm text-[#333333] py-2"
                value={query}
                onChangeText={setQuery}
              />
            </View>
          </View>
          <View style={{ maxHeight: 240, width: '100%' }}>
            <ScrollView 
              nestedScrollEnabled={true} 
              keyboardShouldPersistTaps="handled"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <TouchableOpacity
                    key={prod.id_producto}
                    className="p-3 rounded-2xl mb-2 bg-[#F8FAFC] active:bg-[#E8E8E8]"
                    onPress={() => {
                      onSelect(prod);
                      setOpen(false);
                      setQuery('');
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-full bg-[#EBF0FF] items-center justify-center">
                        <Icon as={Package} size={16} className="text-[#748FFC]" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-bold text-[#333333] text-sm">{prod.nombre}</Text>
                        <Text className="text-xs text-[#999999]">{prod.codigo} • S/ {prod.precio}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="p-4 rounded-2xl bg-[#F8FAFC]">
                  <Text className="text-sm text-[#999999]">No se encontró ningún producto.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}