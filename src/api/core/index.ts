/**
 * API Core - Instancia de Axios configurada con helpers
 * Centraliza toda la lógica de comunicación con el backend
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { BaseResponse } from '@/dtos/core/baseResponse.dto';
import { CheckStatus } from '@/dtos/core/checkStatus.dto';
import { API_RESPONSE_STATUS } from '@/dtos/core/const';
import type { CreateResponse } from '@/dtos/core/createResponse.dto';

// ===== CONFIGURACIÓN =====
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = true; // Cambiar a false cuando backend esté listo

// ===== INSTANCIA AXIOS =====
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== INTERCEPTORES =====
// Aquí irían: auth token, error handling, etc
// Por ahora, básico para móvil

// ===== TIPOS HELPER =====
interface ApiListResponse<T> {
  isOk(): boolean;
  isNoData(): boolean;
  getMessage(): string;
  data: T[];
  total: number;
}

interface ApiOneResponse<T> {
  isOk(): boolean;
  getMessage(): string;
  data: T | null;
}

// ===== HELPERS PARA CONSUMIR API =====

/**
 * GET lista paginada
 * Maneja tanto respuestas reales como mock
 */
export async function getList<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiListResponse<T>> {
  try {
    if (USE_MOCK_DATA) {
      // Importar mock según el endpoint
      return handleMockRequest<T>(url, 'GET', config) as Promise<ApiListResponse<T>>;
    }

    const response = await axiosInstance.get(url, config);
    const baseResponse = new BaseResponse(response.data);

    return {
      isOk: () => baseResponse.isOk?.() ?? false,
      isNoData: () => baseResponse.isNoData?.() ?? false,
      getMessage: () => baseResponse.getMessage?.() ?? '',
      data: response.data?.data ?? [],
      total: response.data?.total ?? 0,
    };
  } catch (error: any) {
    return {
      isOk: () => false,
      isNoData: () => false,
      getMessage: () => 'Error al obtener datos',
      data: [],
      total: 0,
    };
  }
}

/**
 * GET detalle de un recurso
 */
export async function getOne<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiOneResponse<T>> {
  try {
    if (USE_MOCK_DATA) {
      return handleMockRequest<T>(url, 'GET', config) as Promise<ApiOneResponse<T>>;
    }

    const response = await axiosInstance.get(url, config);
    const baseResponse = new BaseResponse(response.data);

    return {
      isOk: () => baseResponse.isOk?.() ?? false,
      getMessage: () => baseResponse.getMessage?.() ?? '',
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    return {
      isOk: () => false,
      getMessage: () => 'Error al obtener dato',
      data: null,
    };
  }
}

/**
 * POST crear recurso y retorna la respuesta
 */
export async function postAndGetOne<T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig,
): Promise<ApiOneResponse<T>> {
  try {
    if (USE_MOCK_DATA) {
      return handleMockRequest<T>(url, 'POST', config, data) as Promise<ApiOneResponse<T>>;
    }

    const response = await axiosInstance.post(url, data, config);
    const baseResponse = new BaseResponse(response.data);

    return {
      isOk: () => baseResponse.isOk?.() ?? false,
      getMessage: () => baseResponse.getMessage?.() ?? '',
      data: response.data?.data ?? null,
    };
  } catch (error: any) {
    return {
      isOk: () => false,
      getMessage: () => 'Error al crear recurso',
      data: null,
    };
  }
}

/**
 * PUT actualizar recurso
 */
export async function putOne(
  url: string,
  data: any,
  config?: AxiosRequestConfig,
): Promise<CheckStatus> {
  try {
    if (USE_MOCK_DATA) {
      return handleMockRequest<any>(url, 'PUT', config, data) as Promise<CheckStatus>;
    }

    const response = await axiosInstance.put(url, data, config);
    return new CheckStatus(response.data);
  } catch (error: any) {
    const checkStatus = new CheckStatus();
    checkStatus.setAxiosError(error);
    return checkStatus;
  }
}

/**
 * DELETE eliminar recurso
 */
export async function deleteOne(
  url: string,
  config?: AxiosRequestConfig,
): Promise<CheckStatus> {
  try {
    if (USE_MOCK_DATA) {
      return handleMockRequest(url, 'DELETE', config) as Promise<CheckStatus>;
    }

    const response = await axiosInstance.delete(url, config);
    return new CheckStatus(response.data);
  } catch (error: any) {
    const checkStatus = new CheckStatus();
    checkStatus.setAxiosError(error);
    return checkStatus;
  }
}

// ===== MOCK DATA HANDLER =====
/**
 * Simula respuestas del backend usando mock data
 * Cuando el backend esté listo, estos helpers se deshabilitarán
 */
function handleMockRequest<T>(
  url: string,
  method: string,
  config?: AxiosRequestConfig,
  data?: any,
): Promise<unknown> {
  // Simular delay de red
  const delay = Math.random() * 500 + 200;

  return new Promise<unknown>((resolve) => {
    setTimeout(() => {
      // Rutas de PRODUCTOS
      if (url.includes('/productos') && method === 'GET' && !url.includes(':')) {
        const { MOCK_PRODUCTS } = require('./mock-data');
        resolve({
          isOk: () => true,
          isNoData: () => false,
          getMessage: () => '',
          data: MOCK_PRODUCTS as T[],
          total: MOCK_PRODUCTS.length,
        });
      } else if (url.includes('/productos/:id') && method === 'GET') {
        const { MOCK_PRODUCT_DETAIL } = require('./mock-data');
        const id = url.split('/').pop();
        const detail = Object.values(MOCK_PRODUCT_DETAIL)?.[0];
        resolve({
          isOk: () => !!detail,
          getMessage: () => detail ? '' : 'Producto no encontrado',
          data: detail || null,
        });
      } else if (url.includes('/productos') && method === 'DELETE') {
        const checkStatus = new CheckStatus();
        checkStatus.status = API_RESPONSE_STATUS.Ok;
        resolve(checkStatus);
      } else if (url.includes('/productos') && method === 'POST') {
        resolve({
          isOk: () => true,
          getMessage: () => 'Creado correctamente',
          data: {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
          },
        });
      } else if (url.includes('/productos') && method === 'PUT') {
        const checkStatus = new CheckStatus();
        checkStatus.status = API_RESPONSE_STATUS.Ok;
        resolve(checkStatus);
      }
      // Por defecto: respuesta genérica
      else {
        resolve({
          isOk: () => true,
          getMessage: () => '',
          data: null,
        });
      }
    }, delay);
  }) as any;
}

// ===== EXPORT CONVENIENCE API OBJECT =====
export const api = {
  getList,
  getOne,
  postAndGetOne,
  putOne,
  deleteOne,
};

export { endpoint } from './endpoints';
