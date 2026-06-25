import { useState } from 'react';
import type { UserListItem } from '@/dtos/users/user.dto';

const MOCK_CURRENT_USER: UserListItem = {
  id: 'session-100',
  nombre_usuario: 'Jomar García',
  correo: 'jomar@welderlegion.com',
  rol: 'ADMIN',
  estado: 1,
};

export function useProfile() {
  const [currentUser] = useState<UserListItem>(MOCK_CURRENT_USER);

  return {
    user: currentUser,
  };
}