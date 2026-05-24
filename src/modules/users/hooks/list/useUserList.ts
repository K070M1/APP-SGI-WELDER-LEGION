import { useState, useMemo } from 'react';
import type { UserListItem } from '@/dtos/users/user.dto';
import { usePagination } from '@/shared/hooks/use-pagination';

const INITIAL_MOCK_USERS: UserListItem[] = [
  { id: '1', id_usuario: 'u-001', nombre: 'Jomar', apellido: 'García', correo: 'jomar@welderlegion.com', rol: 'ADMIN', id_estado: 1, estado: 'ACTIVO', fecha_creacion: '2026-01-10' },
  { id: '2', id_usuario: 'u-002', nombre: 'Carlos', apellido: 'Mendoza', correo: 'carlos.m@welderlegion.com', rol: 'ALMACENERO', id_estado: 1, estado: 'ACTIVO', fecha_creacion: '2026-02-15' },
  { id: '3', id_usuario: 'u-003', nombre: 'Luis', apellido: 'Pinedo', correo: 'luis.p@welderlegion.com', rol: 'OPERARIO', id_estado: 0, estado: 'INACTIVO', fecha_creacion: '2026-03-20' },
  { id: '4', id_usuario: 'u-004', nombre: 'Ana', apellido: 'Ramos', correo: 'ana.r@welderlegion.com', rol: 'OPERARIO', id_estado: 1, estado: 'ACTIVO', fecha_creacion: '2026-04-02' },
];

export function useUserList() {
  const [users] = useState<UserListItem[]>(INITIAL_MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState({ value: 'all', label: 'Todos' });
  const [statusFilter, setStatusFilter] = useState({ value: 'all', label: 'Todos' });

  // Estados para el Modal Singleton de Detalle
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const pagination = usePagination(users.length, 10);

  const handleClearFilters = () => {
    setSearchQuery('');
    setRoleFilter({ value: 'all', label: 'Todos' });
    setStatusFilter({ value: 'all', label: 'Todos' });
  };

  const handleOpenDetail = (user: UserListItem) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  // Paginación local sobre el mock
  const paginatedUsers = useMemo(() => {
    const start = (pagination.currentPage - 1) * Number(pagination.pageSize);
    const end = pagination.currentPage * Number(pagination.pageSize);
    return users.slice(start, end);
  }, [users, pagination.currentPage, pagination.pageSize]);

  return {
    users: paginatedUsers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    selectedUser,
    isDetailOpen,
    setIsDetailOpen,
    handleOpenDetail,
    handleClearFilters,
    pagination,
  };
}