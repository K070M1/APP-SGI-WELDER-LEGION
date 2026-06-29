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
import { useAuthStore } from '@/api/auth/auth.store';

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
    try {
      const userId = useAuthStore.getState().user?.id;
      
      if (!userId) {
        throw new Error("No hay usuario autenticado.");
      }

      // 1. Crear el registro maestro de movimiento
      const { data: movData, error: movError } = await insforge.database
        .from('movimiento')
        .insert({
          tipo: payload.tipo,
          observaciones: payload.observaciones,
          id_usuario: userId
        })
        .select()
        .single();

      if (movError) {
        console.error('Error insertando movimiento:', movError);
        throw movError;
      }

      // 2. Crear los detalles (productos) asociados al movimiento
      const detallesToInsert = payload.detalles.map(d => ({
        id_movimiento: movData.id,
        id_producto: d.id_producto,
        cantidad: d.cantidad,
        stockInicial: d.stockInicial,
        stockFinal: d.stockFinal,
        observaciones: d.observaciones
      }));

      const { error: detError } = await insforge.database
        .from('detalle_movimiento')
        .insert(detallesToInsert);

      if (detError) {
        console.error('Error insertando detalles:', detError);
        throw detError;
      }

      return {
        isOk: () => true,
        getMessage: () => 'Movimiento creado exitosamente',
        data: movData as MovementListItem
      };
    } catch (error: any) {
      console.error('Error en createMovement:', error);
      throw error;
    }
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
