/**
 * Product Service
 * Centraliza toda la lógica de llamadas API para productos
 * Actúa como capa entre los hooks y la API real
 */

import type {
  ProductListItem,
  ProductDetail,
} from '@/dtos/products/product.dto';

import type { ProductCreateDto } from '@/dtos/products/product.create.dto';
import type { ProductUpdateDto } from '@/dtos/products/product.update.dto';
import type { ProductFilters } from '@/dtos/products/product.filters.dto';
import { insforge } from '@/lib/insforge';

/**
 * ProductService - Singleton
 * Todos los métodos de interacción con la API de productos
 */
export class ProductService {
  /**
   * Obtener lista de productos con filtros y paginación
   */
  private mapProduct(row: any): ProductDetail {
    return {
      id: row.id,
      id_producto: row.id,

      nombre: row.nombre ?? '',
      codigo: row.codigo ?? '',
      precio: Number(row.precio ?? 0),

      stock: Number(row.stock ?? 0),
      stock_min: Number(row.stockMin ?? 0),

      descripcion: row.descripcion ?? null,

      id_marca: row.id_marca ?? '',
      nombre_marca: row.marca?.nombre ?? '',

      id_subcategoria: row.id_subcategoria ?? '',
      nombre_subcategoria: row.subcategoria?.nombre ?? '',

      id_moneda: row.id_moneda ?? '',
      simbolo_moneda: row.moneda?.simbolo ?? 'S/',

      // La tabla producto no tiene estado actualmente.
      id_estado: 1,
      estado: 'ACTIVO',

      fecha_creacion: row.created_at,
      fecha_edicion: row.updated_at,

      especificaciones: {},
    };
  }
  async getProducts(filters: ProductFilters = {}) {
    try {
      const { data, error } = await insforge.database
        .from('producto')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      let products: ProductListItem[] = (data ?? []).map((row: any) => ({
        id: row.id,
        id_producto: row.id,
        nombre: row.nombre ?? '',
        codigo: row.codigo ?? '',
        precio: Number(row.precio ?? 0),
        stock: Number(row.stock ?? 0),
        stock_min: Number(row.stockMin ?? 0),

        descripcion: row.descripcion ?? null,
        id_marca: row.id_marca ?? '',
        id_subcategoria: row.id_subcategoria ?? '',
        id_moneda: row.id_moneda ?? '',

        // La tabla actual no tiene estado.
        // Temporalmente todos se consideran activos.
        id_estado: 1,
        estado: 'ACTIVO',

        fecha_creacion: row.created_at,
        fecha_edicion: row.updated_at,
      }));

      const texto = filters.buscar?.trim().toLowerCase();

      if (texto) {
        products = products.filter(
          (product) =>
            product.nombre.toLowerCase().includes(texto) ||
            product.codigo.toLowerCase().includes(texto)
        );
      }

      if (
        filters.id_estado !== undefined &&
        filters.id_estado !== '' &&
        filters.id_estado !== 'all'
      ) {
        const estadoBuscado = String(filters.id_estado).toUpperCase();

        products = products.filter(
          (product) =>
            String(product.id_estado) === estadoBuscado ||
            product.estado.toUpperCase() === estadoBuscado
        );
      }
      // Filtrar por subcategoría.
      if (
        filters.id_categoria &&
        filters.id_categoria !== 'all'
      ) {
        products = products.filter(
          (product) =>
            product.id_subcategoria === filters.id_categoria
        );
      }

      // Filtrar por nivel de stock antes de paginar.
      if (filters.stock_filter === 'low_stock') {
        products = products.filter(
          (product) =>
            product.stock <= product.stock_min
        );
      }

      if (filters.stock_filter === 'with_stock') {
        products = products.filter(
          (product) => product.stock > 0
        );
      }
      if (
        filters.id_marca &&
        filters.id_marca !== 'all'
      ) {
        products = products.filter(
          (product) =>
            product.id_marca === filters.id_marca
        );
      }

      const total = products.length;
      const pagina = Math.max(1, Number(filters.pagina ?? 1));
      const tamanio = Math.max(1, Number(filters.tamanio ?? 10));
      const inicio = (pagina - 1) * tamanio;

      const paginatedProducts = products.slice(
        inicio,
        inicio + tamanio
      );

      return {
        isOk: () => true,
        isNoData: () => total === 0,
        getMessage: () =>
          total === 0 ? 'No se encontraron productos.' : '',
        data: paginatedProducts,
        total,
      };
    } catch (error) {
      console.error('Error al obtener productos reales:', error);

      return {
        isOk: () => false,
        isNoData: () => false,
        getMessage: () =>
          'No fue posible obtener los productos.',
        data: [] as ProductListItem[],
        total: 0,
      };
    }
  }

  /**
   * Obtener detalle de un producto por ID
   */
  async getProductById(id: string) {
    try {
      const { data, error } = await insforge.database
        .from('producto')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error(
          'Error obteniendo producto:',
          error
        );

        return {
          isOk: () => false,
          isNoData: () => true,
          getMessage: () =>
            'No fue posible obtener el producto.',
          data: null as unknown as ProductDetail,
        };
      }

      return {
        isOk: () => true,
        isNoData: () => false,
        getMessage: () => '',
        data: this.mapProduct(data),
      };
    } catch (error) {
      console.error(
        'Error inesperado obteniendo producto:',
        error
      );

      return {
        isOk: () => false,
        isNoData: () => false,
        getMessage: () =>
          'Ocurrió un error al obtener el producto.',
        data: null as unknown as ProductDetail,
      };
    }
  }

  /**
   * Obtener productos para select/combo
   */
  async getProductsSelect() {
    return this.getProducts({
      pagina: 1,
      tamanio: 1000,
    });
  }

  /**
   * Crear nuevo producto
   */
  async createProduct(payload: ProductCreateDto) {
    try {
      const productToInsert = {
        nombre: payload.nombre.trim(),
        codigo: payload.codigo.trim(),
        precio: Number(payload.precio),

        // El formulario no solicita stock inicial.
        stock: 0,

        // La columna real utiliza camelCase.
        stockMin: Number(payload.stock_min),

        descripcion:
          payload.descripcion?.trim() || null,

        id_marca: payload.id_marca,
        id_subcategoria: payload.id_subcategoria,
        id_moneda: payload.id_moneda,
      };

      const { data, error } = await insforge.database
        .from('producto')
        .insert(productToInsert)
        .select()
        .single();

      if (error || !data) {
        console.error(
          'Error creando producto:',
          error
        );

        return {
          isOk: () => false,
          isNoData: () => false,
          getMessage: () =>
            error?.message ||
            'No fue posible crear el producto.',
          data: null as unknown as ProductListItem,
        };
      }

      return {
        isOk: () => true,
        isNoData: () => false,
        getMessage: () =>
          'Producto creado correctamente.',
        data: this.mapProduct(data),
      };
    } catch (error: any) {
      console.error(
        'Error inesperado creando producto:',
        error
      );

      return {
        isOk: () => false,
        isNoData: () => false,
        getMessage: () =>
          error?.message ||
          'Ocurrió un error al crear el producto.',
        data: null as unknown as ProductListItem,
      };
    }
  }

  /**
   * Actualizar producto existente
   */
  async updateProduct(
    id: string,
    payload: ProductUpdateDto
  ) {
    try {
      const productToUpdate: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (payload.nombre !== undefined) {
        productToUpdate.nombre = payload.nombre.trim();
      }

      if (payload.codigo !== undefined) {
        productToUpdate.codigo = payload.codigo.trim();
      }

      if (payload.precio !== undefined) {
        productToUpdate.precio = Number(
          payload.precio
        );
      }

      if (payload.stock_min !== undefined) {
        productToUpdate.stockMin = Number(
          payload.stock_min
        );
      }

      if (payload.descripcion !== undefined) {
        productToUpdate.descripcion =
          payload.descripcion?.trim() || null;
      }

      if (payload.id_marca !== undefined) {
        productToUpdate.id_marca =
          payload.id_marca;
      }

      if (payload.id_subcategoria !== undefined) {
        productToUpdate.id_subcategoria =
          payload.id_subcategoria;
      }

      if (payload.id_moneda !== undefined) {
        productToUpdate.id_moneda =
          payload.id_moneda;
      }

      /*
      * No enviamos id_estado porque esa columna
      * no existe en la tabla producto.
      */

      const { data, error } = await insforge.database
        .from('producto')
        .update(productToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        console.error(
          'Error actualizando producto:',
          error
        );

        return {
          isOk: () => false,
          isNoData: () => false,
          getMessage: () =>
            error?.message ||
            'No fue posible actualizar el producto.',
          data: null as unknown as ProductDetail,
        };
      }

      return {
        isOk: () => true,
        isNoData: () => false,
        getMessage: () =>
          'Producto actualizado correctamente.',
        data: this.mapProduct(data),
      };
    } catch (error: any) {
      console.error(
        'Error inesperado actualizando producto:',
        error
      );

      return {
        isOk: () => false,
        isNoData: () => false,
        getMessage: () =>
          error?.message ||
          'Ocurrió un error al actualizar el producto.',
        data: null as unknown as ProductDetail,
      };
    }
  }

  /**
   * Eliminar producto
   */
    async deleteProduct(id: string) {
      try {
        const { error } = await insforge.database
          .from('producto')
          .delete()
          .eq('id', id);

        if (error) {
          console.error(
            'Error eliminando producto:',
            error
          );

          return {
            isOk: () => false,
            isNoData: () => false,
            getMessage: () =>
              error.message ||
              'No fue posible eliminar el producto.',
          };
        }

        return {
          isOk: () => true,
          isNoData: () => false,
          getMessage: () =>
            'Producto eliminado correctamente.',
        };
      } catch (error: any) {
        console.error(
          'Error inesperado eliminando producto:',
          error
        );

        return {
          isOk: () => false,
          isNoData: () => false,
          getMessage: () =>
            error?.message ||
            'Ocurrió un error al eliminar el producto.',
        };
      }
    }
  }

// ===== SINGLETON EXPORT =====
export const productService = new ProductService();