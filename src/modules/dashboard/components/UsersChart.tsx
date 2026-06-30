import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/shared/components/ui/text';
import { ROUTES } from '@/navigation/routes';
import { ChartCard } from './ChartCard';
import { useUsersChart } from '../hooks/useUsersChart';

export function UsersChart() {
  const navigation = useNavigation<any>();
  const { data, isLoading } = useUsersChart();
  const maxVal = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;

  return (
    <ChartCard
      title="Personal del SGI"
      subtitle="Usuarios activos por rol"
      isLoading={isLoading}
      onPressGoTo={() => navigation.navigate(ROUTES.USERS.LIST as never)}
    >
      <View className="h-40 flex-row items-end justify-around px-2">
        {data.map((item) => {
          const heightPercent = Math.max((item.value / maxVal) * 100, 5);
          return (
            <View key={item.label} className="items-center w-16">
              <Text className="text-[10px] font-bold text-[#999999] mb-1">{item.value}</Text>
              <View style={{ height: `${heightPercent}%` }} className="w-10 rounded-t-xl bg-[#333333]" />
              <Text className="text-[10px] mt-2 font-bold text-[#333333] text-center">{item.label}</Text>
            </View>
          );
        })}
      </View>
    </ChartCard>
  );
}