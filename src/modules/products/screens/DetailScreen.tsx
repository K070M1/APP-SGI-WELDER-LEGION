import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator,
  ScrollView,
} from 'react-native';
import { productService } from 'src/api/product/product.service'

import { LucideMessageCircleWarning } from 'lucide-react-native';
import { Button } from '@/shared/components/ui/button';

export function ProductDetailScreen({ route, navigation }: any) {
  const { id } = route.params;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);

        const response = await productService.getProductById(id);

        if (response.isOk()) {
          console.log('Product details fetched successfully:', response.data);
          setProduct(response.data);
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-4 text-gray-500">
          Cargando información...
        </Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Text className="text-lg font-semibold text-red-600">
          No se pudo cargar el producto
        </Text>
      </View>
    );
  }

  const Item = ({ label, value }: any) => (
    <View className="mb-4 border-b border-slate-200 pb-3">
      <Text className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </Text>
      <Text className="mt-1 text-base font-medium text-slate-900">
        {value}
      </Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-slate-100">
      <View className="m-4 rounded-2xl bg-white p-5 shadow-sm">

        <Text className="text-sm font-medium text-slate-500 text-center">
          Descripción del producto
        </Text>

        <Text className="text-2xl font-bold text-slate-900 text-center">
          {product.nombre}
        </Text>

        <Text className="mt-1 text-slate-500 text-center">
          {product.nombre_marca ?? '-'}
        </Text>

        <View className="mt-6">
          <Item
            label="Subcategoría"
            value={`${product.nombre_categoria ?? '-'} / ${product.nombre_subcategoria ?? '-'
              }`}
          />

          <Item
            label="Precio"
            value={`${product.simbolo_moneda ?? 'S/'} ${product.precio}`}
          />

          <Item
            label="Stock Actual"
            value={product.stock}
          />

          <Item
            label="Stock mínimo"
            value={product.stock_min}
          />

          {
            (product.stock < product.stock_min) && (
              <View className="flex-row items-center gap-2 mb-4 border-b border-slate-200 pb-3">
                <LucideMessageCircleWarning size={20} color="#DC2626" />
                <Text className="text-xs uppercase tracking-wide text-red-600">
                  Stock bajo: {product.stock} unidades (mínimo {product.stock_min})
                </Text>
              </View>
            )
          }

          <Item
            label="Descripción"
            value={product.descripcion || 'Sin descripción'}
          />
        </View>
      </View>
      <Button className="mx-4 mb-4" variant="default" onPress={() => navigation.goBack()}>
        <Text className="text-base font-medium text-white">
          Volver a la lista
        </Text>
      </Button>
    </ScrollView>
  );
}