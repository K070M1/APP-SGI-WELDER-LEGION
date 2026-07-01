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
      title="Top Productos en Stock"
      subtitle="Los 5 productos con mayor cantidad"
      isLoading={isLoading}
      onPressGoTo={() => navigation.navigate(ROUTES.PRODUCTS.LIST as never)}
    >
      <View className="h-40 flex-row items-end justify-around px-2">
        {data.map((item, index) => {
          const heightPercent = Math.max((item.value / maxVal) * 80, 5);
          return (
            <View key={`${item.label}-${index}`} className="items-center w-16">
              <Text className="text-[10px] font-bold text-[#999999] mb-1">{item.value}</Text>
              <View style={{ height: `${heightPercent}%` }} className="w-10 rounded-t-xl bg-[#3B82F6]" />
              <Text className="text-[10px] mt-2 text-[#999999] text-center" numberOfLines={1}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </ChartCard>
  );
}