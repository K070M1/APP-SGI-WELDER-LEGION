import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/shared/components/ui/text';
import { ROUTES } from '@/navigation/routes';
import { ChartCard } from './ChartCard';
import { useActiveUsersChart } from '../hooks/useActiveUsersChart';

export function ActiveUsersChart() {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useActiveUsersChart();
  const maxVal = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;

  return (
    <ChartCard
      title="Usuarios más activos"
      subtitle="Usuarios con más movimientos recientes"
      isLoading={isLoading}
      onPressGoTo={() => navigation.navigate(ROUTES.USERS.LIST as never)}
    >
      <View className="h-40 flex-row items-end justify-around px-2">
        {data.map((item, index) => {
          const heightPercent = Math.max((item.value / maxVal) * 80, 5);
          return (
            <View key={`${item.label}-${index}`} className="items-center w-16">
              <Text className="text-[10px] font-bold text-[#999999] mb-1">{item.value}</Text>
              <View style={{ height: `${heightPercent}%` }} className="w-10 rounded-t-xl bg-[#64748B]" />
              <Text className="text-[10px] mt-2 font-bold text-[#64748B] text-center" numberOfLines={1}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </ChartCard>
  );
}
