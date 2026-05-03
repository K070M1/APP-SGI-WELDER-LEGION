import React from 'react';
import { View, Text } from 'react-native';

export function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
      <Text className="text-xl font-bold text-[#333333]">Pantalla de Login</Text>
      <Text className="text-sm text-muted-foreground mt-2">Aquí irá el formulario de acceso.</Text>
    </View>
  );
}