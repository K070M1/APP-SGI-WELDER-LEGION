import React from 'react';
import { View, Text } from 'react-native';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface Movement {
  id: string;
  tipo: 'ENTRADA' | 'SALIDA';
  prefijo: string; // ej. MOV-001
  descripcion: string; // ej. 2 productos
  total: number;
}

interface MovementCardProps {
  movement: Movement;
  onViewDetails: (id: string) => void;
}

export const MovementCard = React.memo(({ movement, onViewDetails }: MovementCardProps) => {
  const isEntrada = movement.tipo === 'ENTRADA';

  // Colores dinámicos basados en la paleta que armamos
  const iconBg = isEntrada ? 'bg-[#69DB7C]/20' : 'bg-[#FF8787]/20';
  const IconComp = isEntrada ? ArrowUpRight : ArrowDownRight;
  const iconColor = isEntrada ? '#2B8A3E' : '#C92A2A';

  return (
    <Card className="mb-4 rounded-[20px] border border-[#E8E8E8] bg-white shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <View className="flex-row items-center mb-4">
          {/* Icono Dinámico */}
          <View className={`w-14 h-14 rounded-xl ${iconBg} items-center justify-center mr-4`}>
            <IconComp color={iconColor} size={28} />
          </View>

          {/* Info Principal */}
          <View className="flex-1">
            <Text className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {isEntrada ? 'Prefijo de Entrada' : 'Prefijo de Salida'}
            </Text>
            <Text className="text-base font-bold text-[#333333] mb-1">
              {movement.prefijo}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {movement.descripcion}
            </Text>
          </View>

          {/* Total Destacado */}
          <View className="items-end justify-center ml-2">
            <Text className="text-xs text-muted-foreground uppercase mb-1">Total</Text>
            <Text className="text-2xl font-bold text-[#333333]">{movement.total}</Text>
          </View>
        </View>

        {/* Botón de Acción */}
        <Button
          variant="outline"
          className="w-full border-[#E8E8E8]"
          onPress={() => onViewDetails(movement.id)}
        >
          VER DETALLES
        </Button>
      </CardContent>
    </Card>
  );
});