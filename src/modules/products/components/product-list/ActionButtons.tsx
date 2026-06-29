import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { QrCode, Edit, Trash2 } from 'lucide-react-native';
import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { ROUTES } from '@/navigation/routes';
import type { ProductListItem } from '@/dtos/products/product.dto';

interface ActionButtonsProps {
  product: ProductListItem;
  onQR: () => void;
  onDelete: () => void;
}

export function ActionButtons({ product, onQR, onDelete }: ActionButtonsProps) {
  const navigation = useNavigation<any>();

  const handleEdit = () => {
    navigation.navigate(ROUTES.PRODUCTS.FORM, { product, id: product.id_producto });
  };

  return (
    <View className="flex-row items-center justify-between pt-4">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 mr-2 flex-row items-center border-[#E8E8E8]"
        onPress={onQR}
      >
        <Icon as={QrCode} size={18} className="text-[#333333] mr-2" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex-1 mr-2 flex-row items-center border-[#E8E8E8]"
        onPress={handleEdit}
      >
        <Icon as={Edit} size={18} className="text-[#143B72] mr-2" />
      </Button>

      <Button
        variant="destructive"
        size="sm"
        className="flex-1 flex-row items-center bg-[#FF8787]"
        onPress={onDelete}
      >
        <Icon as={Trash2} size={18} className="text-white mr-2" />
      </Button>
    </View>
  );
}