import React from 'react';
import { View, FlatList, TextInput, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, FilterIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/shared/components/ui/select';
import { ProductCard } from '../components/product-list/ProductCard';

import { PRODUCT_STOCK_OPTIONS, PRODUCT_STATUS_OPTIONS } from '@/shared/constants/filters';
import { ROUTES } from '@/navigation/routes';

import { usePagination } from '@/shared/hooks/use-pagination';
import { Pagination } from '@/shared/components/composed/pagination';
import { useUiOverlay } from '@/shared/contexts/UiOverlayContext';
import { useProductList } from '../hooks/list/useProductList';
import { useProductFilterForm } from '../hooks/list/useProductFilterForm';
import type { ProductListItem } from '@/dtos/products/product.dto';
import type { ProductFilterFormValues } from '../schema';

export function ProductListScreen() {
  const navigation = useNavigation<any>();
  const { showAlert } = useUiOverlay();

  const { products, total, loading, notFoundMessage, search, setProducts } = useProductList({
    onError: (msg) => showAlert({ icon: 'error', title: 'Error', text: msg }),
  });

  const { form, handleFilter } = useProductFilterForm((values: ProductFilterFormValues) => {
    search({
      buscar: values.buscar,
      id_estado: values.id_estado,
      id_categoria: values.id_categoria,
      pagina: 1,
      tamanio: Number(pagination.pageSize),
    });
  });

  const pagination = usePagination(total, 10);

  const [stockFilter, setStockFilter] = React.useState({ value: 'all', label: 'Todos' });

  React.useEffect(() => {
    search({ pagina: 1, tamanio: 10 });
  }, []);

  const filteredProducts = React.useMemo(() => {
    if (stockFilter.value === 'all') return products;
    if (stockFilter.value === 'low_stock') return products.filter(p => p.stock <= p.stock_min);
    if (stockFilter.value === 'with_stock') return products.filter(p => p.stock > p.stock_min);
    return products;
  }, [products, stockFilter]);

  const pageSizeNumber = Number(pagination.pageSize);
  const currentPageSafe = Math.min(pagination.currentPage, pagination.totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPageSafe - 1) * pageSizeNumber,
    currentPageSafe * pageSizeNumber
  );

  const handleIncrementStock = (id_producto: string) => {
    setProducts(prev => prev.map(p => p.id_producto === id_producto ? { ...p, stock: p.stock + 1 } : p));
  };

  const handleDecrementStock = (id_producto: string) => {
    setProducts(prev => prev.map(p => p.id_producto === id_producto && p.stock > 0 ? { ...p, stock: p.stock - 1 } : p));
  };

  const handleShowQR = (product: ProductListItem) => {
    showAlert({
      isQR: true,
      title: 'Código QR',
      text: product.nombre,
      qrCode: product.codigo,
    });
  };

  const handleDeleteProduct = (id_producto: string) => {
    const product = products.find(p => p.id_producto === id_producto);
    if (!product) return;
    showAlert({
      icon: 'warning',
      title: '¿Eliminar Producto?',
      text: `${product.nombre}\n\nEsta acción no se puede deshacer.`,
      actions: [
        { name: 'CANCELAR', color: 'white', onClick: () => true },
        {
          name: 'SÍ, ELIMINAR',
          color: 'red',
          onClick: async () => {
            setProducts(prev => prev.filter(p => p.id_producto !== id_producto));
            showAlert({
              icon: 'success',
              title: '¡Eliminado!',
              text: `${product.nombre} ha sido eliminado correctamente.`,
              actions: [{ name: 'ACEPTAR', color: 'blue', onClick: () => true }],
            });
            return true;
          },
        },
      ],
    });
  };

  const handleClearFilters = () => {
    form.reset();
    setStockFilter({ value: 'all', label: 'Todos' });
    search({ pagina: 1, tamanio: Number(pagination.pageSize) });
  };

  const statusValue = form.watch('id_estado');

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <View className="flex-1 px-4 pt-4">

        {/* Cabecera */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-extrabold text-slate-900 leading-tight">PRODUCTOS</Text>
            <Text className="text-sm text-slate-500 font-medium mt-1">Gestiona tu Inventario</Text>
          </View>
          <Button
            className="rounded-2xl shadow-sm px-4 flex-row items-center bg-[#748FFC]"
            onPress={() => navigation.navigate(ROUTES.PRODUCTS.FORM as any)}
          >
            <Icon as={Plus} className="size-5 text-white mr-2" />
            <Text className="text-white font-bold text-sm">Nuevo</Text>
          </Button>
        </View>

        {/* Filtros */}
        <View className="mb-6 gap-3">
          <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4">
            <Icon as={Search} className="size-5 text-slate-400" />
            <TextInput
              placeholder="Buscar por nombre o código..."
              placeholderTextColor="#94a3b8"
              className="flex-1 ml-3 text-sm text-slate-900 font-medium h-10"
              value={form.watch('buscar') ?? ''}
              onChangeText={(v) => form.setValue('buscar', v)}
            />
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1">
              <Select value={stockFilter} onValueChange={(o) => setStockFilter(o as any)}>
                <SelectTrigger className="rounded-xl bg-white border border-slate-200 h-10">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent align="start" sideOffset={8} className="w-56 rounded-xl border-slate-100">
                  <SelectGroup>
                    <SelectLabel><Text className="font-bold text-slate-900">Nivel de Stock</Text></SelectLabel>
                    {PRODUCT_STOCK_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value} label={o.label}>
                        <Text>{o.description}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            <View className="flex-1">
              <Select
                value={statusValue ? { value: statusValue, label: statusValue === 'active' ? 'Activo' : 'Inactivo' } : { value: 'all', label: 'Todos' }}
                onValueChange={(o) => form.setValue('id_estado', (o as any).value === 'all' ? undefined : (o as any).value)}
              >
                <SelectTrigger className="rounded-xl bg-white border border-slate-200 h-10">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent align="end" sideOffset={8} className="w-56 rounded-xl border-slate-100">
                  <SelectGroup>
                    <SelectLabel><Text className="font-bold text-slate-900">Estado</Text></SelectLabel>
                    {PRODUCT_STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value} label={o.label}>
                        <Text>{o.description}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>
          </View>

          <View className="flex-row gap-2 mt-1">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-slate-200 h-10 flex-row items-center justify-center bg-white"
              onPress={handleClearFilters}
            >
              <Icon as={FilterIcon} className="size-4 text-slate-500 mr-2" />
              <Text className="text-slate-600 font-bold text-xs">Limpiar</Text>
            </Button>
            <Button
              className="flex-1 rounded-xl h-10 flex-row items-center justify-center bg-[#748FFC]"
              onPress={handleFilter}
            >
              <Icon as={Search} className="size-4 text-white mr-2" />
              <Text className="text-white font-bold text-xs">Buscar</Text>
            </Button>
          </View>
        </View>

        {/* Loading */}
        {loading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#748FFC" />
          </View>
        )}

        {/* Sin resultados */}
        {!loading && notFoundMessage && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-slate-400 text-sm font-medium">{notFoundMessage}</Text>
          </View>
        )}

        {/* Lista */}
        {!loading && !notFoundMessage && (
          <FlatList
            data={paginatedProducts}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === 'ios' ? 120 : 100,
              paddingHorizontal: 2,
            }}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onIncrementStock={handleIncrementStock}
                onDecrementStock={handleDecrementStock}
                onDelete={handleDeleteProduct}
                onQR={() => handleShowQR(item)}
              />
            )}
          />
        )}

        <View className="border-t border-slate-200 mt-5 mb-2" />
        <Pagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalRecords={total}
          pageStart={pagination.pageStart}
          pageEnd={pagination.pageEnd}
          canNextPage={pagination.canNextPage}
          canPrevPage={pagination.canPrevPage}
          onNextPage={pagination.handleNextPage}
          onPrevPage={pagination.handlePrevPage}
          onPageSizeChange={pagination.handlePageSizeChange}
        />
      </View>
    </SafeAreaView>
  );
}