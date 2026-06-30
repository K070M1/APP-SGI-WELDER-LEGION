import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowUpRight } from 'lucide-react-native';
import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';

interface ChartCardProps {
  title: string;
  subtitle: string;
  isLoading: boolean;
  onPressGoTo: () => void;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, isLoading, onPressGoTo, children }: ChartCardProps) {
  return (
    <View className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-sm mb-6 mx-4">
      <View className="flex-row justify-between items-start mb-6">
        <View className="flex-1 mr-4">
          <Text className="font-bold text-[#333333] text-lg">{title}</Text>
          <Text className="text-xs text-[#999999] mt-1">{subtitle}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressGoTo}
          className="size-10 bg-[#F8FAFC] rounded-2xl items-center justify-center border border-[#E8E8E8]"
        >
          <Icon as={ArrowUpRight} size={18} className="text-[#748FFC]" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator size="large" color="#748FFC" />
        </View>
      ) : (
        children
      )}
    </View>
  );
}