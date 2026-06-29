import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MovementListItemDTO } from '@/dtos/movements/movement.dto';
import { usePagination } from '@/shared/hooks/use-pagination';
import type { MovementFilterValues } from '../../schema';
import { movementService } from '@/api/movement/movement.service';
import { Alert } from 'react-native';

export function useMovementList(filters: MovementFilterValues) {
  const [movements, setMovements] = useState<MovementListItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovements = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await movementService.getMovements({
        tipo: filters.category !== 'all' ? (filters.category as any) : undefined
      });
      setMovements(data);
    } catch (error: any) {
      console.error('Failed to fetch movements', error);
      Alert.alert(
        'Error de Base de Datos',
        `No se pudo cargar los datos. Detalle del error: ${error?.message || error?.details || JSON.stringify(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters.category]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const filteredMovements = useMemo(() => {
    const { searchQuery, motive } = filters;
    const normalizedQuery = searchQuery?.trim().toLowerCase() ?? '';

    return movements.filter((movement) => {
      const matchesMotive = motive === 'all' || movement.motivo === motive;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        (movement.cliente && movement.cliente.toLowerCase().includes(normalizedQuery)) ||
        movement.detalles?.some(d => 
          d.codigo_producto.toLowerCase().includes(normalizedQuery) ||
          d.nombre_producto.toLowerCase().includes(normalizedQuery)
        );

      return matchesMotive && matchesQuery;
    });
  }, [movements, filters]);

  const pagination = usePagination(filteredMovements.length, 10);

  const paginatedMovements = useMemo(() => {
    const start = (pagination.currentPage - 1) * Number(pagination.pageSize);
    const end = pagination.currentPage * Number(pagination.pageSize);
    return filteredMovements.slice(start, end);
  }, [filteredMovements, pagination.currentPage, pagination.pageSize]);

  return {
    movements: paginatedMovements,
    isLoading,
    pagination,
    refetch: fetchMovements
  };
}