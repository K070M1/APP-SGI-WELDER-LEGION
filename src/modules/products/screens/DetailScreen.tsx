import React from 'react';
import { View, Text } from 'react-native';

export function ProductDetailScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
      <Text className="text-xl font-bold text-[#333333]">Detalle del Producto</Text>
      <Text className="text-sm text-muted-foreground mt-2">Ficha técnica y código QR gigante.</Text>
    </View>
  );
}