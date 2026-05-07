/**
 * Movement Service
 * Centraliza toda la lógica de llamadas API para movimientos
 */

import { api, endpoint as apiEndpoint } from '@/api/core';
import { ENDPOINTS } from '@/api/core/endpoints';
import type { MovementListItem } from '@/dtos/movements/movement.dto';
import type { MovementCreateDto } from '@/dtos/movements/movement.create.dto';
import type { MovementUpdateDto } from '@/dtos/movements/movement.update.dto';
import type { MovementFilters } from '@/dtos/movements/movement.filters.dto';
import { CheckStatus } from '@/dtos/core/checkStatus.dto';

export class MovementService {
  async getMovements(filters: MovementFilters) {
    return api.getList<MovementListItem>(ENDPOINTS.MOVEMENTS, {
      params: filters,
    });
  }

  async getMovementById(id: string) {
    const url = apiEndpoint(ENDPOINTS.MOVEMENTS_BY_ID, { id });
    return api.getOne<MovementListItem>(url);
  }

  async createMovement(payload: MovementCreateDto) {
    return api.postAndGetOne<MovementListItem>(ENDPOINTS.MOVEMENTS, payload);
  }

  async updateMovement(id: string, payload: MovementUpdateDto): Promise<CheckStatus> {
    const url = apiEndpoint(ENDPOINTS.MOVEMENTS_BY_ID, { id });
    return api.putOne(url, payload);
  }

  async deleteMovement(id: string): Promise<CheckStatus> {
    const url = apiEndpoint(ENDPOINTS.MOVEMENTS_BY_ID, { id });
    return api.deleteOne(url);
  }
}

export const movementService = new MovementService();
