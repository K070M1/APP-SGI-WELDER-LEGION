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
      <View className="h-40 flex-row items-end justify-around px-8">
        {data.map((item, index) => {
          const heightPercent = Math.max((item.value / maxVal) * 80, 5);
          const isLatest = index === data.length - 1;

          return (
            <View key={`${item.label}-${index}`} className="items-center w-20">
              <Text className="text-[12px] font-bold text-[#999999] mb-1">{item.value}</Text>
              <View style={{ height: `${heightPercent}%` }} className={`w-12 rounded-t-xl ${isLatest ? 'bg-[#1E293B]' : 'bg-[#E2E8F0]'}`} />
              <Text className={`text-[12px] mt-2 ${isLatest ? 'font-bold text-[#1E293B]' : 'text-[#64748B]'}`}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </ChartCard>
  );
}