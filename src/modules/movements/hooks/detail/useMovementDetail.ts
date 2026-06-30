import { useState, useEffect } from 'react';
import type { MovementListItemDTO } from '@/dtos/movements/movement.dto';
import { movementService } from '@/api/movement/movement.service';
import { Alert } from 'react-native';

export function useMovementDetail(idMovimiento: string) {
  const [movement, setMovement] = useState<MovementListItemDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const data = await movementService.getMovementById(idMovimiento);
        setMovement(data);
      } catch (error: any) {
        console.error('Error fetching movement detail:', error);
        Alert.alert('Error', 'No se pudo cargar el detalle del movimiento');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (idMovimiento && idMovimiento !== 'mov-desconocido') {
      fetchDetail();
    } else {
      setIsLoading(false);
    }
  }, [idMovimiento]);

  return { movement, isLoading };
}