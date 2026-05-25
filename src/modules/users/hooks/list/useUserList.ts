import { useState, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import type { UserListItem } from '@/dtos/users/user.dto';
import { usePagination } from '@/shared/hooks/use-pagination';
import { userService } from '@/api/user/user.service';

export function useUserList() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState({ value: 'all', label: 'Todos' });
  const [statusFilter, setStatusFilter] = useState({ value: 'all', label: 'Todos' });

  // Estados para el Modal Singleton de Detalle
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const pagination = usePagination(users.length, 10);

  // Cargar usuarios al iniciar
  useEffect(() => {
    loadUsers();
  }, []); // Solo cargar una vez al montar el componente

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const result = await userService.getUsers({
        buscar: searchQuery,
        rol: roleFilter.value,
        estado: statusFilter.value,
      });

      setUsers(result.data || []);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setRoleFilter({ value: 'all', label: 'Todos' });
    setStatusFilter({ value: 'all', label: 'Todos' });
    // Recargar con filtros limpios
    setTimeout(() => loadUsers(), 100);
  };

  const handleOpenDetail = (user: UserListItem) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.deleteUser(userId);
              Alert.alert('Éxito', 'Usuario eliminado correctamente');
              loadUsers(); // Recargar lista
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo eliminar el usuario');
            }
          },
        },
      ]
    );
  };

  // Paginación local
  const paginatedUsers = useMemo(() => {
    const start = (pagination.currentPage - 1) * Number(pagination.pageSize);
    const end = pagination.currentPage * Number(pagination.pageSize);
    return users.slice(start, end);
  }, [users, pagination.currentPage, pagination.pageSize]);

  return {
    users: paginatedUsers,
    isLoading,
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
    handleDeleteUser,
    handleClearFilters,
    loadUsers,
    pagination,
  };
}