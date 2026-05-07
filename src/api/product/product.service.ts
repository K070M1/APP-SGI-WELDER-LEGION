/**
 * Product Service
 * Centraliza toda la lógica de llamadas API para productos
 * Actúa como capa entre los hooks y la API real
 */

import { api, endpoint as apiEndpoint } from '@/api/core';
import { ENDPOINTS } from '@/api/core/endpoints';
import type { ProductListItem, ProductDetail } from '@/dtos/products/product.dto';
import type { ProductCreateDto } from '@/dtos/products/product.create.dto';
import type { ProductUpdateDto } from '@/dtos/products/product.update.dto';
import type { ProductFilters } from '@/dtos/products/product.filters.dto';
import { CheckStatus } from '@/dtos/core/checkStatus.dto';

/**
 * ProductService - Singleton
 * Todos los métodos de interacción con la API de productos
 */
export class ProductService {
  /**
   * Obtener lista de productos con filtros y paginación
   */
  async getProducts(filters: ProductFilters) {
    return api.getList<ProductListItem>(ENDPOINTS.PRODUCTS, {
      params: filters,
    });
  }

  /**
   * Obtener detalle de un producto por ID
   */
  async getProductById(id: string) {
    const url = apiEndpoint(ENDPOINTS.PRODUCTS_BY_ID, { id });
    return api.getOne<ProductDetail>(url);
  }

  /**
   * Obtener productos para select/combo
   */
  async getProductsSelect() {
    return api.getList<ProductListItem>(ENDPOINTS.PRODUCTS_SELECT);
  }

  /**
   * Crear nuevo producto
   */
  async createProduct(payload: ProductCreateDto) {
    return api.postAndGetOne<ProductListItem>(ENDPOINTS.PRODUCTS, payload);
  }

  /**
   * Actualizar producto existente
   */
  async updateProduct(id: string, payload: ProductUpdateDto): Promise<CheckStatus> {
    const url = apiEndpoint(ENDPOINTS.PRODUCTS_BY_ID, { id });
    return api.putOne(url, payload);
  }

  /**
   * Eliminar producto
   */
  async deleteProduct(id: string): Promise<CheckStatus> {
    const url = apiEndpoint(ENDPOINTS.PRODUCTS_BY_ID, { id });
    return api.deleteOne(url);
  }
}

// ===== SINGLETON EXPORT =====
export const productService = new ProductService();
