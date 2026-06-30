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
      const cleanUrl = url.split('?')[0];

      // Rutas de PRODUCTOS
      if (cleanUrl.endsWith('/productos/select') && method === 'GET') {
        const { MOCK_PRODUCTS } = require('./mock-data');
        resolve({
          isOk: () => true,
          getMessage: () => '',
          data: MOCK_PRODUCTS as T[],
        });
      } else if (cleanUrl.endsWith('/productos') && method === 'GET') {
        const { MOCK_PRODUCTS } = require('./mock-data');
        resolve({
          isOk: () => true,
          isNoData: () => false,
          getMessage: () => '',
          data: MOCK_PRODUCTS as T[],
          total: MOCK_PRODUCTS.length,
        });
      } else if (cleanUrl.includes('/productos/') && method === 'GET') {
        const { MOCK_PRODUCT_DETAIL } = require('./mock-data');
        const id = cleanUrl.split('/').pop() || '';
        const detail = MOCK_PRODUCT_DETAIL[id];
        resolve({
          isOk: () => !!detail,
          getMessage: () => detail ? '' : 'Producto no encontrado',
          data: detail || null,
        });
      } else if (cleanUrl.includes('/productos/') && method === 'DELETE') {
        const { MOCK_PRODUCTS, MOCK_PRODUCT_DETAIL } = require('./mock-data');
        const id = cleanUrl.split('/').pop() || '';
        const idx = MOCK_PRODUCTS.findIndex((p: any) => p.id_producto === id);
        if (idx !== -1) {
          MOCK_PRODUCTS.splice(idx, 1);
        }
        delete MOCK_PRODUCT_DETAIL[id];

        const checkStatus = new CheckStatus();
        checkStatus.status = API_RESPONSE_STATUS.Ok;
        resolve(checkStatus);
      } else if (cleanUrl.endsWith('/productos') && method === 'POST') {
        const { MOCK_PRODUCTS, MOCK_PRODUCT_DETAIL } = require('./mock-data');
        const newId = `prod-${Math.random().toString(36).substr(2, 9)}`;
        const newProduct = {
          id: Math.random().toString(36).substr(2, 9),
          id_producto: newId,
          nombre: data.nombre,
          codigo: data.codigo,
          precio: Number(data.precio),
          stock: 0,
          stock_min: Number(data.stock_min),
          id_estado: Number(data.id_estado),
          estado: Number(data.id_estado) === 1 ? 'ACTIVO' : 'INACTIVO',
          fecha_creacion: new Date().toISOString().split('T')[0],
          usuario_creacion: 'admin',
        };
        MOCK_PRODUCTS.push(newProduct);
        MOCK_PRODUCT_DETAIL[newId] = {
          ...newProduct,
          descripcion: data.descripcion || null,
          id_marca: data.id_marca,
          nombre_marca: 'Marca Genérica',
          id_subcategoria: data.id_subcategoria,
          nombre_subcategoria: 'Categoría Genérica',
          id_moneda: data.id_moneda,
          simbolo_moneda: data.id_moneda === 'usd' ? '$' : 'S/',
        };
        resolve({
          isOk: () => true,
          getMessage: () => 'Creado correctamente',
          data: newProduct,
        });
      } else if (cleanUrl.includes('/productos/') && method === 'PUT') {
        const { MOCK_PRODUCTS, MOCK_PRODUCT_DETAIL } = require('./mock-data');
        const id = cleanUrl.split('/').pop() || '';

        const idx = MOCK_PRODUCTS.findIndex((p: any) => p.id_producto === id);
        if (idx !== -1) {
          MOCK_PRODUCTS[idx] = {
            ...MOCK_PRODUCTS[idx],
            nombre: data.nombre ?? MOCK_PRODUCTS[idx].nombre,
            codigo: data.codigo ?? MOCK_PRODUCTS[idx].codigo,
            precio: data.precio !== undefined ? Number(data.precio) : MOCK_PRODUCTS[idx].precio,
            stock_min: data.stock_min !== undefined ? Number(data.stock_min) : MOCK_PRODUCTS[idx].stock_min,
            id_estado: data.id_estado !== undefined ? Number(data.id_estado) : MOCK_PRODUCTS[idx].id_estado,
            estado: (data.id_estado !== undefined ? Number(data.id_estado) : MOCK_PRODUCTS[idx].id_estado) === 1 ? 'ACTIVO' : 'INACTIVO',
          };
        }

        if (MOCK_PRODUCT_DETAIL[id]) {
          MOCK_PRODUCT_DETAIL[id] = {
            ...MOCK_PRODUCT_DETAIL[id],
            nombre: data.nombre ?? MOCK_PRODUCT_DETAIL[id].nombre,
            codigo: data.codigo ?? MOCK_PRODUCT_DETAIL[id].codigo,
            precio: data.precio !== undefined ? Number(data.precio) : MOCK_PRODUCT_DETAIL[id].precio,
            stock_min: data.stock_min !== undefined ? Number(data.stock_min) : MOCK_PRODUCT_DETAIL[id].stock_min,
            id_estado: data.id_estado !== undefined ? Number(data.id_estado) : MOCK_PRODUCT_DETAIL[id].id_estado,
            estado: (data.id_estado !== undefined ? Number(data.id_estado) : MOCK_PRODUCT_DETAIL[id].id_estado) === 1 ? 'ACTIVO' : 'INACTIVO',
            descripcion: data.descripcion !== undefined ? data.descripcion : MOCK_PRODUCT_DETAIL[id].descripcion,
            id_marca: data.id_marca ?? MOCK_PRODUCT_DETAIL[id].id_marca,
            id_subcategoria: data.id_subcategoria ?? MOCK_PRODUCT_DETAIL[id].id_subcategoria,
            id_moneda: data.id_moneda ?? MOCK_PRODUCT_DETAIL[id].id_moneda,
          };
        }

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
