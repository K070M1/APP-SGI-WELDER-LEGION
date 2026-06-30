import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/shared/components/ui/text';
import { useAuth } from '@/shared/hooks/use-auth';

import { DashboardKPIs } from '@/modules/dashboard/components/DashboardKPIs';
import { ProductsChart } from '@/modules/dashboard/components/ProductsChart';
import { MovementsChart } from '@/modules/dashboard/components/MovementsChart';
import { UsersChart } from '@/modules/dashboard/components/UsersChart';

export function DashboardScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* CABECERA GENERAL */}
      <View className="px-5 pt-4 pb-2">
        <Text className="text-[12px] font-bold text-[#999999] uppercase tracking-widest mb-1">
          Panel de Control
        </Text>
        <Text className="text-3xl font-extrabold text-[#333333] leading-tight">
          Hola, {user?.nombreUsuario?.split(' ')[0] || 'Usuario'}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* BLOQUE DE KPIs */}
        <DashboardKPIs />

        {/* GRÁFICOS INDEPENDIENTES */}
        <ProductsChart />
        <MovementsChart />
        <UsersChart />

      </ScrollView>
    </SafeAreaView>
  );
}