/**
 * User Service
 * Centraliza toda la lógica de llamadas API para usuarios
 */

import { api, endpoint as apiEndpoint } from '@/api/core';
import { ENDPOINTS } from '@/api/core/endpoints';
import type { UserListItem } from '@/dtos/users/user.dto';
import type { UserCreateDto } from '@/dtos/users/user.create.dto';
import type { UserUpdateDto } from '@/dtos/users/user.update.dto';
import type { UserFilters } from '@/dtos/users/user.filters.dto';
import { CheckStatus } from '@/dtos/core/checkStatus.dto';

export class UserService {
  async getUsers(filters: UserFilters) {
    return api.getList<UserListItem>(ENDPOINTS.USERS, {
      params: filters,
    });
  }

  async getUserById(id: string) {
    const url = apiEndpoint(ENDPOINTS.USERS_BY_ID, { id });
    return api.getOne<UserListItem>(url);
  }

  async getUsersSelect() {
    return api.getList<UserListItem>(ENDPOINTS.USERS_SELECT);
  }

  async createUser(payload: UserCreateDto) {
    return api.postAndGetOne<UserListItem>(ENDPOINTS.USERS, payload);
  }

  async updateUser(id: string, payload: UserUpdateDto): Promise<CheckStatus> {
    const url = apiEndpoint(ENDPOINTS.USERS_BY_ID, { id });
    return api.putOne(url, payload);
  }

  async deleteUser(id: string): Promise<CheckStatus> {
    const url = apiEndpoint(ENDPOINTS.USERS_BY_ID, { id });
    return api.deleteOne(url);
  }
}

export const userService = new UserService();
