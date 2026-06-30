import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/shared/components/ui/text';
import { ROUTES } from '@/navigation/routes';
import { ChartCard } from './ChartCard';
import { useProductsChart } from '../hooks/useProductsChart';

export function ProductsChart() {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useProductsChart();
  const maxVal = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;

  return (
    <ChartCard
      title="Inventario por Categoría"
      subtitle="Distribución actual de productos"
      isLoading={isLoading}
      onPressGoTo={() => navigation.navigate(ROUTES.PRODUCTS.LIST as never)}
    >
      <View className="h-40 flex-row items-end justify-around px-2">
        {data.map((item) => {
          const heightPercent = Math.max((item.value / maxVal) * 100, 5);
          return (
            <View key={item.label} className="items-center w-16">
              <Text className="text-[10px] font-bold text-[#999999] mb-1">{item.value}</Text>
              <View style={{ height: `${heightPercent}%` }} className="w-10 rounded-t-xl bg-[#748FFC]" />
              <Text className="text-[10px] mt-2 text-[#999999] text-center" numberOfLines={1}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </ChartCard>
  );
}