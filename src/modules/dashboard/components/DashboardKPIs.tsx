import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Package, AlertTriangle, ArrowLeftRight, Users } from 'lucide-react-native';
import { KPICard } from '@/shared/components/composed/KPICard';
import { useDashboardKPIs } from '../hooks/useDashboardKPIs';

export function DashboardKPIs() {
  const { data, isLoading } = useDashboardKPIs();

  if (isLoading || !data) {
    return (
      <View className="py-10 items-center justify-center">
        <ActivityIndicator size="large" color="#748FFC" />
      </View>
    );
  }

  return (
    <View className="px-2 mb-6 mt-4">
      <View className="flex-row mb-4">
        <KPICard title="Total Productos" value={data.totalProducts} icon={Package} />
        <KPICard title="Stock Crítico" value={data.lowStockProducts} bgColorClass="bg-[#E2E8F0]" textColorClass="text-[#1E293B]" icon={AlertTriangle} />
      </View>
      <View className="flex-row">
        <KPICard title="Movimientos Hoy" value={data.movementsToday} icon={ArrowLeftRight} />
        <KPICard title="Usuarios Activos" value={data.activeUsers} icon={Users} />
      </View>
    </View>
  );
}