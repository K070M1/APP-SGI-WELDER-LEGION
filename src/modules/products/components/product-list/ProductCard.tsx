import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Minus, Plus, Package, AlertTriangle } from 'lucide-react-native';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils/tw';
import type { ProductListItem } from '@/dtos/products/product.dto';
import { ActionButtons } from './ActionButtons';

interface ProductCardProps {
  product: ProductListItem;
  onIncrementStock: (id_producto: string) => void;
  onDecrementStock: (id_producto: string) => void;
  onDelete: (id_producto: string) => void;
  onPressImage?: () => void;
  onQR?: () => void;
}

const STATUS_BADGE_MAP: Record<number, { text: string; badgeClass: string; textClass: string }> = {
  1: {
    text: 'ACTIVO',
    badgeClass: 'bg-emerald-100 border-emerald-200',
    textClass: 'text-emerald-700',
  },
  0: {
    text: 'INACTIVO',
    badgeClass: 'bg-slate-100 border-slate-200',
    textClass: 'text-slate-500',
  },
};

export function ProductCard({
  product,
  onIncrementStock,
  onDecrementStock,
  onDelete,
  onPressImage,
  onQR = () => {
    // TODO: Implementar QR
  },
}: ProductCardProps) {

  const statusBadge = STATUS_BADGE_MAP[product.id_estado] || STATUS_BADGE_MAP[0];
  const isLowStock = product.stock <= product.stock_min;

  return (
    <View className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-4">

      <View className="flex-row items-start gap-4 mb-3">
        <TouchableOpacity onPress={onPressImage} activeOpacity={0.7}>
          <Avatar alt={product.nombre} className="size-16 rounded-full bg-[#748FFC]/10 border border-[#748FFC]/20 flex items-center justify-center">
            <AvatarFallback className='bg-white/10'>
              <Icon as={Package} className="size-8 text-[#748FFC]" />
            </AvatarFallback>
          </Avatar>
        </TouchableOpacity>

        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="font-bold text-base leading-5 text-[#333333] flex-1 mr-2" numberOfLines={1}>
              {product.nombre.length > 20 ? product.nombre.slice(0, 20) + '...' : product.nombre}
            </Text>
            <Badge variant="default" className={`${statusBadge.badgeClass} rounded-lg px-2 py-0.5 border shadow-sm`}>
              <Text className={`${statusBadge.textClass} text-[10px] font-bold tracking-wider uppercase`}>
                {statusBadge.text}
              </Text>
            </Badge>
          </View>
          <Text className="text-muted-foreground text-xs font-normal leading-4 tracking-wider uppercase mb-1">
            CÓD: {product.codigo}
          </Text>

          {/* Fila del Precio y Alerta de Stock */}
          <View className="flex-row justify-between items-center mt-1">
            <Text className="text-xl font-extrabold text-[#748FFC] leading-6">
              S/ {product.precio.toFixed(2)}
            </Text>

            {/* Badge de Stock Crítico */}
            {isLowStock && (
              <View className="flex-row items-center bg-red-50 px-2 py-1 rounded-md border border-red-100">
                <Icon as={AlertTriangle} className="size-3 text-red-500 mr-1" />
                <Text className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                  Stock Crítico
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="border-t border-slate-100 my-1" />

      <View className="flex-row justify-between items-center py-2 mb-1">
        <Text className="text-sm font-semibold text-slate-500 flex-1">
          En Inventario
        </Text>

        <View className="flex-row items-center bg-slate-50 rounded-full border border-slate-200 overflow-hidden shadow-sm">
          <TouchableOpacity
            onPress={() => onDecrementStock(product.id_producto)}
            className="px-3 py-2 items-center justify-center border-r border-slate-200 bg-white active:bg-slate-100"
            disabled={product.stock <= 0}
          >
            <Icon
              as={Minus}
              className={cn("size-4 text-slate-600", product.stock <= 0 && "text-slate-300")}
            />
          </TouchableOpacity>

          <View className="w-16 items-center justify-center bg-slate-50 py-2">
            <Text className="font-extrabold text-slate-900 text-lg leading-5">
              {product.stock}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onIncrementStock(product.id_producto)}
            className="px-3 py-2 items-center justify-center border-l border-slate-200 bg-blue-50 active:bg-blue-100"
          >
            <Icon as={Plus} className="size-4 text-blue-600" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="border-t border-slate-100 my-1" />

      <ActionButtons
        product={product}
        onQR={onQR}
        onDelete={() => onDelete(product.id_producto)}
      />
    </View>
  );
}