import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/shared/components/ui/text';
import { ROUTES } from '@/navigation/routes';
import { ChartCard } from './ChartCard';
import { useMovementsChart } from '../hooks/useMovementsChart';

export function MovementsChart() {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useMovementsChart();
  const maxVal = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;

  return (
    <ChartCard
      title="Flujo de Movimientos"
      subtitle="Entradas y salidas recientes"
      isLoading={isLoading}
      onPressGoTo={() => navigation.navigate(ROUTES.MOVEMENTS.LIST as never)}
    >
      <View className="h-40 flex-row items-end justify-between px-2">
        {data.map((item, index) => {
          const heightPercent = Math.max((item.value / maxVal) * 100, 5);
          const isLatest = index === data.length - 1;

          return (
            <View key={item.label} className="items-center w-10">
              <Text className="text-[10px] font-bold text-[#999999] mb-1">{item.value}</Text>
              <View style={{ height: `${heightPercent}%` }} className={`w-6 rounded-t-lg ${isLatest ? 'bg-[#FF8787]' : 'bg-[#FFE5E5]'}`} />
              <Text className={`text-xs mt-2 ${isLatest ? 'font-bold text-[#FF8787]' : 'text-[#999999]'}`}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </ChartCard>
  );
}