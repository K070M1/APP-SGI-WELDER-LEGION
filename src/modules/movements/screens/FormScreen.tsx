import React from 'react';
import { View, Text } from 'react-native';

export function MovementFormScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
      <Text className="text-xl font-bold text-[#333333]">Registrar Movimiento</Text>
      <Text className="text-sm text-muted-foreground mt-2">Flujo de Entrada o Salida.</Text>
    </View>
  );
}