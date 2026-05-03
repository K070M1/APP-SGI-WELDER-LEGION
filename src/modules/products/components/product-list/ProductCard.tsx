import React from 'react';
import { View, Text, Image } from 'react-native';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ActionButtons } from '../product-list/ActionBUttons';

// Usamos una interfaz simplificada para el ejemplo, luego la ataremos a tu DTO real
interface Product {
  id: string;
  nombre: string;
  codigo_sku: string;
  categoria: string;
  estado: string;
  id_estado: number;
  cantidad: number;
  precio_unitario: number;
}

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onQR: (id: string) => void;
}

const ESTADO_ACTIVO = 1;

function ProductCardComponent({ product, onEdit, onDelete, onQR }: ProductCardProps) {
  const isActive = product.id_estado === ESTADO_ACTIVO;

  return (
    <Card className="mb-4 rounded-[20px] border border-[#E8E8E8] bg-white shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <View className="flex-row">
          {/* Imagen / Placeholder */}
          <View className="w-20 h-20 rounded-xl bg-[#F8FAFC] border border-[#E8E8E8] items-center justify-center mr-4">
            <Text className="text-muted-foreground text-xs font-medium">IMG</Text>
          </View>

          {/* Información Principal */}
          <View className="flex-1 justify-between">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 pr-2">
                <Text className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {product.categoria}
                </Text>
                <Text className="text-base font-bold text-[#333333] mb-1 leading-tight" numberOfLines={2}>
                  {product.nombre}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  SKU: {product.codigo_sku}
                </Text>
              </View>

              {/* Columna Derecha (Estado y KPIs) */}
              <View className="items-end">
                <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-[#69DB7C]' : ''}>
                  <Text className={isActive ? 'text-white font-bold' : ''}>
                    {product.estado}
                  </Text>
                </Badge>
                <View className="mt-2 items-end">
                  <Text className="text-xs text-muted-foreground">Stock</Text>
                  <Text className="text-lg font-bold text-[#748FFC]">{product.cantidad}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Acciones */}
        <ActionButtons
          onQR={() => onQR(product.id)}
          onEdit={() => onEdit(product.id)}
          onDelete={() => onDelete(product.id)}
        />
      </CardContent>
    </Card>
  );
}

// CRÍTICO para listas móviles: Memoizar para evitar re-renders innecesarios
export const ProductCard = React.memo(ProductCardComponent, (prevProps, nextProps) => {
  return prevProps.product.id === nextProps.product.id &&
    prevProps.product.id_estado === nextProps.product.id_estado &&
    prevProps.product.cantidad === nextProps.product.cantidad;
});