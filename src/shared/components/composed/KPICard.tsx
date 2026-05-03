import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface KPICardProps {
  title: string;
  value: string | number;
  bgColorClass?: string;
  textColorClass?: string;
  icon?: LucideIcon;
}

export function KPICard({
  title,
  value,
  bgColorClass = 'bg-white',
  textColorClass = 'text-[#333333]',
  icon: Icon
}: KPICardProps) {
  return (
    <Pressable
      className={`relative overflow-hidden rounded-[24px] p-5 min-w-[120px] flex-1 mx-2 shadow-sm active:scale-95 transition-transform ${bgColorClass}`}
    >
      {Icon && (
        <View className="absolute -right-3 -bottom-3 opacity-10">
          <Icon size={70} color="#000000" />
        </View>
      )}

      <Text className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 z-10">
        {title}
      </Text>

      <Text className={`text-3xl font-extrabold tracking-tight z-10 ${textColorClass}`}>
        {value}
      </Text>
    </Pressable>
  );
}