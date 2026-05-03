import React from 'react';
import { View } from 'react-native';
import { QrCode, Edit, Trash2 } from 'lucide-react-native';
import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';

interface ActionButtonsProps {
  onQR: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionButtons({ onQR, onEdit, onDelete }: ActionButtonsProps) {
  return (
    <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-border/50">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 mr-2 flex-row items-center border-[#E8E8E8]"
        onPress={onQR}
      >
        <Icon as={QrCode} size={18} className="text-[#333333] mr-2" />
        {/* Usamos un texto nativo de la librería o Text estándar */}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex-1 mr-2 flex-row items-center border-[#E8E8E8]"
        onPress={onEdit}
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