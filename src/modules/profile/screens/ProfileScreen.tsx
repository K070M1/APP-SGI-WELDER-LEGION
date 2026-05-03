import React from 'react';
import { View, Text } from 'react-native';

export function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-[#F8FAFC]">
      <Text className="text-xl font-bold text-[#333333]">Mi Perfil</Text>
      <Text className="text-sm text-muted-foreground mt-2">Ajustes y cierre de sesión.</Text>
    </View>
  );
}