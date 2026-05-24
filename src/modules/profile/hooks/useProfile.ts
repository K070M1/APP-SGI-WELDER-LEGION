import { useState } from 'react';
import type { UserListItem } from '@/dtos/users/user.dto';

const MOCK_CURRENT_USER: UserListItem = {
  id: 'session-100',
  id_usuario: 'u-admin',
  nombre: 'Jomar',
  apellido: 'García',
  correo: 'jomar@welderlegion.com',
  rol: 'ADMIN',
  id_estado: 1,
  estado: 'ACTIVO',
  fecha_creacion: '2026-01-10',
};

export function useProfile() {
  const [currentUser] = useState<UserListItem>(MOCK_CURRENT_USER);

  return {
    user: currentUser,
  };
}