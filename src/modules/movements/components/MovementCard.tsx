import React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui/text';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/tw';
import { ArrowDownLeft, ArrowUpRight, Wrench, Eye } from 'lucide-react-native';
import type { MovementListItemDTO, MovementType } from '@/dtos/movements/movement.dto';

interface MovementCardProps {
  movement: MovementListItemDTO;
}

export function MovementCard({ movement }: MovementCardProps) {
  const { tipo, productoCodigo, productoNombre, cantidad, observaciones, fechaRegistro, usuarioNombre } = movement;

  // Configuración visual basada en la categoría
  const typeConfig: Record<MovementType, { 
    colorText: string; 
    colorIcon: string;
    bgIcon: string; 
    bgBadge: string; 
    Icon: React.ElementType; 
    badgeVariant: 'success' | 'destructive' | 'warning' | 'default' 
  }> = {
    ENTRADA: {
      colorText: 'text-emerald-700 dark:text-emerald-400',
      colorIcon: 'text-emerald-600',
      bgIcon: 'bg-emerald-50 dark:bg-emerald-900/30',
      bgBadge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
      Icon: ArrowDownLeft,
      badgeVariant: 'success',
    },
    SALIDA: {
      colorText: 'text-orange-700 dark:text-orange-400',
      colorIcon: 'text-orange-600',
      bgIcon: 'bg-orange-50 dark:bg-orange-900/30',
      bgBadge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
      Icon: ArrowUpRight,
      badgeVariant: 'warning',
    },
    AJUSTE: {
      colorText: 'text-gray-700 dark:text-gray-400',
      colorIcon: 'text-gray-600',
      bgIcon: 'bg-gray-100 dark:bg-gray-800',
      bgBadge: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
      Icon: Wrench,
      badgeVariant: 'default',
    },
  };

  const config = typeConfig[tipo] || typeConfig['AJUSTE'];
  const Icon = config.Icon;

  // Formatear la fecha (ej: "2026-05-10")
  const dateObj = new Date(fechaRegistro);
  const formattedDate = !isNaN(dateObj.getTime()) 
    ? dateObj.toISOString().split('T')[0] 
    : fechaRegistro;

  return (
    <View className="mb-4 rounded-3xl border border-border bg-card shadow-sm overflow-hidden p-4">
      
      {/* Cuerpo principal */}
      <View className="flex-row items-center mb-4">
        {/* Icono izquierdo */}
        <View className={cn('w-14 h-14 rounded-full items-center justify-center mr-4 border border-border/50', config.bgIcon)}>
          <Icon size={24} className={config.colorIcon} />
        </View>

        {/* Contenido Derecho */}
        <View className="flex-1">
          {/* Fila 1: Código y Badge */}
          <View className="flex-row justify-between items-start">
            <Text className="text-base font-bold text-foreground">
              {productoCodigo}
            </Text>
            <Badge variant={config.badgeVariant} className={cn('px-2 py-0.5 rounded-md', config.bgBadge)}>
              <Text className={cn('text-[10px] font-bold uppercase tracking-wider', config.colorText)}>
                {tipo}
              </Text>
            </Badge>
          </View>

          {/* Fila 2: Entidad */}
          <Text className="text-sm text-muted-foreground mt-1 mb-2" numberOfLines={1}>
            {productoNombre}
          </Text>

          {/* Fila 3: Items y Motivo */}
          <View className="flex-row justify-between items-center mt-1">
            <Text className="text-[15px] font-bold text-[#748FFC]">
              {cantidad} Items
            </Text>
            <Text className="text-sm font-bold text-foreground uppercase tracking-wide">
              {observaciones && observaciones !== 'N/A' ? observaciones : tipo}
            </Text>
          </View>
        </View>
      </View>

      {/* Separador */}
      <View className="h-[1px] bg-border mb-3" />

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-muted-foreground font-medium">
          {formattedDate} • {usuarioNombre}
        </Text>
        
        <Button variant="outline" size="sm" className="h-8 px-4 rounded-2xl flex-row items-center space-x-1.5 border-border">
          <Eye size={14} className="text-foreground" />
          <Text className="text-xs font-bold ml-1.5">Ver</Text>
        </Button>
      </View>
    </View>
  );
}
