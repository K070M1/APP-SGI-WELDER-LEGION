/**
 * Movement Service
 * Centraliza toda la lógica de llamadas API para movimientos
 */

import { api, endpoint as apiEndpoint } from '@/api/core';
import { ENDPOINTS } from '@/api/core/endpoints';
import type { MovementListItem, MovementListItemDTO } from '@/dtos/movements/movement.dto';
import type { MovementCreateDto } from '@/dtos/movements/movement.create.dto';
import type { MovementUpdateDto } from '@/dtos/movements/movement.update.dto';
import type { MovementFilters } from '@/dtos/movements/movement.filters.dto';
import { CheckStatus } from '@/dtos/core/checkStatus.dto';
import { insforge } from '@/lib/insforge';

export class MovementService {
  async getMovements(filters?: MovementFilters): Promise<MovementListItemDTO[]> {
    let query = insforge.database
      .from('movimiento')
      .select(`
        id,
        fechaRegistro,
        tipo,
        observaciones,
        usuario (
          nombreUsuario
        ),
        detalle_movimiento (
          cantidad,
          producto (
            nombre,
            codigo
          )
        )
      `)
      .order('fechaRegistro', { ascending: false });

    if (filters?.tipo && filters.tipo !== 'TODOS' as any) {
      query = query.eq('tipo', filters.tipo);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching movements:', error);
      throw error;
    }

    return (data || []).map((row: any) => {
      const detalle = row.detalle_movimiento?.[0] || {};
      const producto = detalle.producto || {};
      const usuario = row.usuario || {};

      return {
        id: row.id,
        tipo: row.tipo || 'AJUSTE',
        observaciones: row.observaciones || 'N/A',
        fechaRegistro: row.fechaRegistro,
        productoNombre: producto.nombre || 'Sin producto',
        productoCodigo: producto.codigo || 'N/A',
        cantidad: detalle.cantidad || 0,
        usuarioNombre: usuario.nombreUsuario || 'admin',
      } as MovementListItemDTO;
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
