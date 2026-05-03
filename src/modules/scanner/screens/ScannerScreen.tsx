import React from 'react';
import { View, Text } from 'react-native';

export function ScannerScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-xl font-bold text-white">Cámara Escáner QR</Text>
    </View>
  );
}