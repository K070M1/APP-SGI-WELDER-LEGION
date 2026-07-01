import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download } from 'lucide-react-native';
import { Icon } from '@/shared/components/ui/icon';

import { Text } from '@/shared/components/ui/text';
import { useAuth } from '@/shared/hooks/use-auth';

import { DashboardKPIs } from '@/modules/dashboard/components/DashboardKPIs';
import { ProductsChart } from '@/modules/dashboard/components/ProductsChart';
import { MovementsChart } from '@/modules/dashboard/components/MovementsChart';
import { UsersChart } from '@/modules/dashboard/components/UsersChart';
import { ActiveUsersChart } from '@/modules/dashboard/components/ActiveUsersChart';
import { generateDashboardPDF } from '@/modules/dashboard/utils/pdf-generator';

export function DashboardScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* CABECERA GENERAL */}
      <View className="flex-row justify-between items-center px-5 pt-4 pb-2">
        <View>
          <Text className="text-[12px] font-bold text-[#999999] uppercase tracking-widest mb-1">
            Panel de Control
          </Text>
          <Text className="text-3xl font-extrabold text-[#333333] leading-tight">
            Hola, {user?.nombreUsuario?.split(' ')[0] || 'Usuario'}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={generateDashboardPDF}
          className="bg-[#3B82F6] w-10 h-10 rounded-xl items-center justify-center shadow-sm"
        >
          <Icon as={Download} size={20} className="text-white" />
        </TouchableOpacity>
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
        <ActiveUsersChart />

      </ScrollView>
    </SafeAreaView>
  );
}