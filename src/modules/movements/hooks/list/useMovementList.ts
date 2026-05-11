import { useMemo } from 'react';
import type { MovementListItem } from '@/dtos/movements/movement.dto';
import { usePagination } from '@/shared/hooks/use-pagination';
import type { MovementFilterValues } from '../../schema';

const INITIAL_MOCK_MOVEMENTS: MovementListItem[] = [
  {
    id: '1',
    id_movimiento: 'mov-001',
    codigo: 'ENT-26-001',
    categoria: 'ENTRADA',
    motivo: 'COMPRA',
    entidad_relacionada: 'Ferretería Industrial S.A.C.',
    cantidad_items: 150,
    monto_total: 4500.0,
    fecha_movimiento: '2026-05-10',
    usuario_creacion: 'admin'
  },
  {
    id: '2',
    id_movimiento: 'mov-002',
    codigo: 'SAL-26-001',
    categoria: 'SALIDA',
    motivo: 'VENTA',
    entidad_relacionada: 'Constructora del Norte EIRL',
    cantidad_items: 12,
    monto_total: 1250.5,
    fecha_movimiento: '2026-05-11',
    usuario_creacion: 'jomar'
  },
  {
    id: '3',
    id_movimiento: 'mov-003',
    codigo: 'SAL-26-002',
    categoria: 'SALIDA',
    motivo: 'MERMA',
    entidad_relacionada: 'Almacén Principal',
    cantidad_items: 2,
    monto_total: 0.0,
    fecha_movimiento: '2026-05-12',
    usuario_creacion: 'admin'
  }
];

export function useMovementList(filters: MovementFilterValues) {
  const filteredMovements = useMemo(() => {
    const { searchQuery, category, motive } = filters;
    const normalizedQuery = searchQuery?.trim().toLowerCase() ?? '';

    return INITIAL_MOCK_MOVEMENTS.filter((movement) => {
      const matchesCategory = category === 'all' || movement.categoria === category;
      const matchesMotive = motive === 'all' || movement.motivo === motive;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        movement.codigo.toLowerCase().includes(normalizedQuery) ||
        movement.entidad_relacionada.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesMotive && matchesQuery;
    });
  }, [filters]);

  const pagination = usePagination(filteredMovements.length, 5);

  const paginatedMovements = useMemo(() => {
    const start = (pagination.currentPage - 1) * Number(pagination.pageSize);
    const end = pagination.currentPage * Number(pagination.pageSize);
    return filteredMovements.slice(start, end);
  }, [filteredMovements, pagination.currentPage, pagination.pageSize]);

  return {
    movements: paginatedMovements,
    pagination,
  };
}