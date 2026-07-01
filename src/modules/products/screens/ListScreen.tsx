import React from 'react';
import {
  View,
  FlatList,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  FilterIcon,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from '@/shared/components/ui/select';

import { ProductCard } from '../components/product-list/ProductCard';

import {
  PRODUCT_STOCK_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
} from '@/shared/constants/filters';

import {
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
} from '@/shared/constants/constants';

import { ROUTES } from '@/navigation/routes';

import { usePagination } from '@/shared/hooks/use-pagination';
import { Pagination } from '@/shared/components/composed/pagination';
import { useUiOverlay } from '@/shared/contexts/UiOverlayContext';
import { useProductList } from '../hooks/list/useProductList';
import { useProductFilterForm } from '../hooks/list/useProductFilterForm';

import type { ProductListItem } from '@/dtos/products/product.dto';
import type { ProductFilterFormValues } from '../schema';
import type {
  ProductStockFilter,
} from '@/dtos/products/product.filters.dto';
import { productService } from '@/api/product/product.service';

interface FilterOption {
  value: string;
  label: string;
}

export function ProductListScreen() {
  const navigation = useNavigation<any>();
  const { showAlert } = useUiOverlay();

  const {
    products,
    total,
    loading,
    notFoundMessage,
    search,
    setProducts,
  } = useProductList({
    onError: (message) =>
      showAlert({
        icon: 'error',
        title: 'Error',
        text: message,
      }),
  });

  const pagination = usePagination(total, 10);

  const [stockFilter, setStockFilter] =
    React.useState<FilterOption>({
      value: 'all',
      label: 'Todos',
    });

  const [brandFilter, setBrandFilter] =
    React.useState<FilterOption>({
      value: 'all',
      label: 'Todas',
    });

  const { form, handleFilter } = useProductFilterForm(
    (values: ProductFilterFormValues) => {
      pagination.resetPage();

      search({
        buscar: values.buscar,
        id_estado: values.id_estado,
        id_categoria: values.id_categoria,

        id_marca:
          brandFilter.value === 'all'
            ? undefined
            : brandFilter.value,

        stock_filter:
          stockFilter.value as ProductStockFilter,

        pagina: 1,
        tamanio: Number(pagination.pageSize),
      });
    }
  );

  React.useEffect(() => {
    const values = form.getValues();

    search({
      buscar: values.buscar,
      id_estado: values.id_estado,
      id_categoria: values.id_categoria,

      id_marca:
        brandFilter.value === 'all'
          ? undefined
          : brandFilter.value,

      stock_filter:
        stockFilter.value as ProductStockFilter,

      pagina: pagination.currentPage,
      tamanio: Number(pagination.pageSize),
    });
  }, [
    pagination.currentPage,
    pagination.pageSize,
  ]);

  const handleIncrementStock = async (
    idProducto: string
  ) => {
    const product = products.find(
      (item) =>
        item.id_producto === idProducto
    );

    if (!product) return;

    const nuevoStock = product.stock + 1;

    const response =
      await productService.updateStock(
        idProducto,
        nuevoStock
      );

    if (!response.isOk()) {
      showAlert({
        icon: 'error',
        title: 'Error',
        text: response.getMessage(),
      });

      return;
    }

    setProducts((previousProducts) =>
      previousProducts.map((item) =>
        item.id_producto === idProducto
          ? {
              ...item,
              stock: nuevoStock,
              fecha_edicion:
                new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleDecrementStock = async (
    idProducto: string
  ) => {
    const product = products.find(
      (item) =>
        item.id_producto === idProducto
    );

    if (!product || product.stock <= 0) {
      return;
    }

    const nuevoStock = product.stock - 1;

    const response =
      await productService.updateStock(
        idProducto,
        nuevoStock
      );

    if (!response.isOk()) {
      showAlert({
        icon: 'error',
        title: 'Error',
        text: response.getMessage(),
      });

      return;
    }

    setProducts((previousProducts) =>
      previousProducts.map((item) =>
        item.id_producto === idProducto
          ? {
              ...item,
              stock: nuevoStock,
              fecha_edicion:
                new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleShowQR = (
    product: ProductListItem
  ) => {
    const ultimaActualizacion =
      product.fecha_edicion
        ? new Date(
            product.fecha_edicion
          ).toLocaleString('es-PE')
        : 'No registrada';

    const qrData = {
      nombre: product.nombre,
      descripcion:
        product.descripcion ?? '',
      precio: product.precio,
      stockActual: product.stock,
      stockMinimo: product.stock_min,
      estado: product.estado,
      ultimaActualizacion:
        product.fecha_edicion ?? '',
      codigo: product.codigo,
    };

    showAlert({
      isQR: true,
      title: 'Información del producto',
      qrCode: product.codigo,
      qrValue: JSON.stringify(qrData),
      qrDetails: [
        {
          label: 'Nombre del producto',
          value:
            product.nombre ||
            'No registrado',
        },
        {
          label: 'Descripción',
          value:
            product.descripcion?.trim() ||
            'No registrada',
        },
        {
          label: 'Precio',
          value: `S/ ${Number(
            product.precio
          ).toFixed(2)}`,
        },
        {
          label: 'Stock actual',
          value: String(product.stock),
        },
        {
          label: 'Stock mínimo',
          value: String(product.stock_min),
        },
        {
          label: 'Estado',
          value:
            product.estado ||
            'No registrado',
        },
        {
          label: 'Última actualización',
          value: ultimaActualizacion,
        },
      ],
    });
  };

  const handleDeleteProduct = (
    idProducto: string
  ) => {
    const product = products.find(
      (item) =>
        item.id_producto === idProducto
    );

    if (!product) {
      return;
    }

    showAlert({
      icon: 'warning',
      title: '¿Eliminar Producto?',
      text:
        `${product.nombre}\n\n` +
        'Esta acción no se puede deshacer.',

      actions: [
        {
          name: 'CANCELAR',
          color: 'white',
          onClick: () => true,
        },
        {
          name: 'SÍ, ELIMINAR',
          color: 'red',

          onClick: async () => {
            const response =
              await productService.deleteProduct(
                idProducto
              );

            if (!response.isOk()) {
              showAlert({
                icon: 'error',
                title: 'No se pudo eliminar',
                text: response.getMessage(),
              });

              return false;
            }

            setProducts((previousProducts) =>
              previousProducts.filter(
                (item) =>
                  item.id_producto !== idProducto
              )
            );

            showAlert({
              icon: 'success',
              title: '¡Eliminado!',
              text:
                `${product.nombre} ha sido ` +
                'eliminado correctamente.',
              actions: [
                {
                  name: 'ACEPTAR',
                  color: 'blue',
                  onClick: () => true,
                },
              ],
            });

            return true;
          },
        },
      ],
    });
  };

  const handleClearFilters = () => {
    form.reset();

    setStockFilter({
      value: 'all',
      label: 'Todos',
    });

    setBrandFilter({
      value: 'all',
      label: 'Todas',
    });

    pagination.resetPage();

    search({
      stock_filter: 'all',
      pagina: 1,
      tamanio: Number(
        pagination.pageSize
      ),
    });
  };

  const statusValue =
    form.watch('id_estado');

  const categoryValue =
    form.watch('id_categoria');

  const selectedStatus =
    statusValue
      ? PRODUCT_STATUS_OPTIONS.find(
          (option) =>
            option.value === statusValue
        ) ?? {
          value: 'all',
          label: 'Todos',
        }
      : {
        value: 'all',
        label: 'Todos',
      };

  const selectedCategory =
    categoryValue
      ? CATEGORY_OPTIONS.find(
          (option) =>
            option.value === categoryValue
        ) ?? {
          value: 'all',
          label: 'Todas',
        }
      : {
        value: 'all',
        label: 'Todas',
      };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <View className="flex-1 px-4 pt-4">

        {/* Cabecera */}
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-extrabold leading-tight text-slate-900">
              PRODUCTOS
            </Text>

            <Text className="mt-1 text-sm font-medium text-slate-500">
              Gestiona tu inventario
            </Text>
          </View>

          <Button
            className="flex-row items-center rounded-2xl bg-[#748FFC] px-4 shadow-sm"
            onPress={() =>
              navigation.navigate(
                ROUTES.PRODUCTS.FORM as any
              )
            }
          >
            <Icon
              as={Plus}
              className="mr-2 size-5 text-white"
            />

            <Text className="text-sm font-bold text-white">
              Nuevo
            </Text>
          </Button>
        </View>

        {/* Filtros */}
        <View className="mb-6 gap-3">

          {/* Búsqueda */}
          <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
            <Icon
              as={Search}
              className="size-5 text-slate-400"
            />

            <TextInput
              placeholder="Buscar por nombre o código..."
              placeholderTextColor="#94a3b8"
              className="ml-3 h-10 flex-1 text-sm font-medium text-slate-900"
              value={
                form.watch('buscar') ?? ''
              }
              onChangeText={(value) =>
                form.setValue(
                  'buscar',
                  value
                )
              }
              returnKeyType="search"
              onSubmitEditing={handleFilter}
            />
          </View>

          {/* Stock y Estado */}
          <View className="flex-row gap-2">

            <View className="flex-1">
              <Select
                value={stockFilter}
                onValueChange={(option) =>
                  setStockFilter(
                    option as FilterOption
                  )
                }
              >
                <SelectTrigger className="h-10 rounded-xl border border-slate-200 bg-white">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>

                <SelectContent
                  align="start"
                  sideOffset={8}
                  className="w-56 rounded-xl border-slate-100"
                >
                  <SelectGroup>
                    <SelectLabel>
                      <Text className="font-bold text-slate-900">
                        Nivel de stock
                      </Text>
                    </SelectLabel>

                    {PRODUCT_STOCK_OPTIONS.map(
                      (option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          label={option.label}
                        >
                          <Text>
                            {option.description}
                          </Text>
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            <View className="flex-1">
              <Select
                value={selectedStatus}
                onValueChange={(option) => {
                  const value = (
                    option as FilterOption
                  ).value;

                  form.setValue(
                    'id_estado',
                    value === 'all'
                      ? undefined
                      : value
                  );
                }}
              >
                <SelectTrigger className="h-10 rounded-xl border border-slate-200 bg-white">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>

                <SelectContent
                  align="end"
                  sideOffset={8}
                  className="w-56 rounded-xl border-slate-100"
                >
                  <SelectGroup>
                    <SelectLabel>
                      <Text className="font-bold text-slate-900">
                        Estado
                      </Text>
                    </SelectLabel>

                    {PRODUCT_STATUS_OPTIONS.map(
                      (option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          label={option.label}
                        >
                          <Text>
                            {option.description}
                          </Text>
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>
          </View>

          {/* Botones */}
          <View className="mt-1 flex-row gap-2">
            <Button
              variant="outline"
              className="h-10 flex-1 flex-row items-center justify-center rounded-xl border-slate-200 bg-white"
              onPress={handleClearFilters}
            >
              <Icon
                as={FilterIcon}
                className="mr-2 size-4 text-slate-500"
              />

              <Text className="text-xs font-bold text-slate-600">
                Limpiar
              </Text>
            </Button>

            <Button
              className="h-10 flex-1 flex-row items-center justify-center rounded-xl bg-[#748FFC]"
              onPress={handleFilter}
            >
              <Icon
                as={Search}
                className="mr-2 size-4 text-white"
              />

              <Text className="text-xs font-bold text-white">
                Buscar
              </Text>
            </Button>
          </View>
        </View>

        {/* Cargando */}
        {loading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color="#748FFC"
            />
          </View>
        )}

        {/* Sin resultados */}
        {!loading && notFoundMessage && (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-sm font-medium text-slate-400">
              {notFoundMessage}
            </Text>
          </View>
        )}

        {/* Listado */}
        {!loading && !notFoundMessage && (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom:
                Platform.OS === 'ios'
                  ? 120
                  : 100,
              paddingHorizontal: 2,
            }}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onIncrementStock={
                  handleIncrementStock
                }
                onDecrementStock={
                  handleDecrementStock
                }
                onDelete={
                  handleDeleteProduct
                }
                onQR={() =>
                  handleShowQR(item)
                }
              />
            )}
          />
        )}

        <View className="mb-2 mt-5 border-t border-slate-200" />

        <Pagination
          currentPage={
            pagination.currentPage
          }
          pageSize={pagination.pageSize}
          totalRecords={total}
          pageStart={pagination.pageStart}
          pageEnd={pagination.pageEnd}
          canNextPage={
            pagination.canNextPage
          }
          canPrevPage={
            pagination.canPrevPage
          }
          onNextPage={
            pagination.handleNextPage
          }
          onPrevPage={
            pagination.handlePrevPage
          }
          onPageSizeChange={
            pagination.handlePageSizeChange
          }
        />
      </View>
    </SafeAreaView>
  );
}