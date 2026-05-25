import React, { useState } from 'react';
import { View, FlatList, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, FilterIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/shared/components/ui/select';
import { ProductCard } from '../components/product-list/ProductCard';
import type { ProductListItem } from '@/dtos/products/product.dto';

import { PRODUCT_STOCK_OPTIONS, PRODUCT_STATUS_OPTIONS } from '@/shared/constants/filters';
import { ROUTES } from '@/navigation/routes';

import { usePagination } from '@/shared/hooks/use-pagination';
import { Pagination } from '@/shared/components/composed/pagination';
import { useUiOverlay } from '@/shared/contexts/UiOverlayContext';


const INITIAL_MOCK_DATA: ProductListItem[] = [
  {
    id: '1',
    id_producto: 'prod-001',
    nombre: 'Electrodo Soldadura E6011 1/8"',
    codigo: 'SOLD-6011',
    precio: 14.50,
    stock: 120,
    stock_min: 50,
    id_estado: 1,
    estado: 'ACTIVO',
    fecha_creacion: '2026-05-01',
    usuario_creacion: 'admin'
  },
  {
    id: '2',
    id_producto: 'prod-002',
    nombre: 'Máquina de Soldar Inverter 250A',
    codigo: 'MAQ-INV-250',
    precio: 850.00,
    stock: 2,
    stock_min: 5,
    id_estado: 1,
    estado: 'ACTIVO',
    fecha_creacion: '2026-05-02',
    usuario_creacion: 'admin'
  },
  {
    id: '3',
    id_producto: 'prod-003',
    nombre: 'Amoladora Angular 4-1/2" Inactiva',
    codigo: 'HERR-AMOL-01',
    precio: 210.00,
    stock: 15,
    stock_min: 3,
    id_estado: 0,
    estado: 'INACTIVO',
    fecha_creacion: '2026-05-03',
    usuario_creacion: 'admin'
  },
];

export function ProductListScreen() {
  const navigation = useNavigation<any>();
  const { showAlert } = useUiOverlay();
  const [products, setProducts] = useState<ProductListItem[]>(INITIAL_MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState({ value: 'all', label: 'Todos' });
  const [statusFilter, setStatusFilter] = useState({ value: 'all', label: 'Todos' });

  const pagination = usePagination(products.length, 10);

  // --- FUNCIONES DE FILTRO ---
  const handleSearch = () => {
    // TODO: Implementar búsqueda
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStockFilter({ value: 'all', label: 'Todos' });
    setStatusFilter({ value: 'all', label: 'Todos' });
    setProducts(INITIAL_MOCK_DATA);
  };

  const pageSizeNumber = Number(pagination.pageSize);
  const currentPageSafe = Math.min(pagination.currentPage, pagination.totalPages);
  const paginatedProducts = products.slice((currentPageSafe - 1) * pageSizeNumber, currentPageSafe * pageSizeNumber);

  // --- FUNCIONES DE MOCK DE STOCK ---
  const handleIncrementStock = (id_producto: string) => {
    setProducts(prev => prev.map(p => p.id_producto === id_producto ? { ...p, stock: p.stock + 1 } : p));
  };

  const handleDecrementStock = (id_producto: string) => {
    setProducts(prev => prev.map(p => p.id_producto === id_producto && p.stock > 0 ? { ...p, stock: p.stock - 1 } : p));
  };

  // --- FUNCIONES DE ACCIONES GLOBALES ---
  const handleShowQR = (product: ProductListItem) => {
    showAlert({
      isQR: true,
      title: `Código QR`,
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
        {
          name: 'CANCELAR',
          color: 'white',
          onClick: () => true,
        },
        {
          name: 'SÍ, ELIMINAR',
          color: 'red',
          onClick: async () => {
            setProducts(prev => prev.filter(p => p.id_producto !== product.id_producto));

            // Mostrar alerta de éxito
            showAlert({
              icon: 'success',
              title: '¡Eliminado!',
              text: `${product.nombre} ha sido eliminado correctamente.`,
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

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <View className="flex-1 px-4 pt-4">

        {/* Cabecera y Título */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <View className="flex-row items-center">
              <Text className="text-3xl font-extrabold text-slate-900 leading-tight">
                PRODUCTOS
              </Text>
            </View>
            <Text className="text-sm text-slate-500 font-medium mt-1">
              Gestiona tu Inventario
            </Text>
          </View>

          <Button
            className="rounded-2xl shadow-sm px-4 flex-row items-center bg-[#748FFC]"
            onPress={() => navigation.navigate(ROUTES.PRODUCTS.FORM as any)}
          >
            <Icon as={Plus} className="size-5 text-white mr-2" />
            <Text className="text-white font-bold text-sm">Nuevo</Text>
          </Button>
        </View>

        {/* Contenedor de Filtros Avanzados */}
        <View className="mb-6 gap-3">
          <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4">
            <Icon as={Search} className="size-5 text-slate-400" />
            <TextInput
              placeholder="Buscar por nombre o código..."
              placeholderTextColor="#94a3b8"
              className="flex-1 ml-3 text-sm text-slate-900 font-medium h-10"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1">
              <Select value={stockFilter} onValueChange={(option) => setStockFilter(option as any)}>
                <SelectTrigger className="rounded-xl bg-white border border-slate-200 h-10">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent align="start" sideOffset={8} className="w-56 rounded-xl border-slate-100">
                  <SelectGroup>
                    <SelectLabel>
                      <Text className="font-bold text-slate-900">Nivel de Stock</Text>
                    </SelectLabel>
                    {PRODUCT_STOCK_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} label={option.label}>
                        <Text>{option.description}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            <View className="flex-1">
              <Select value={statusFilter} onValueChange={(option) => setStatusFilter(option as any)}>
                <SelectTrigger className="rounded-xl bg-white border border-slate-200 h-10">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent align="end" sideOffset={8} className="w-56 rounded-xl border-slate-100">
                  <SelectGroup>
                    <SelectLabel>
                      <Text className="font-bold text-slate-900">Estado</Text>
                    </SelectLabel>
                    {PRODUCT_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} label={option.label}>
                        <Text>{option.description}</Text>
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
              onPress={handleSearch}
            >
              <Icon as={Search} className="size-4 text-white mr-2" />
              <Text className="text-white font-bold text-xs">Buscar</Text>
            </Button>
          </View>
        </View>

        {/* Lista de Productos */}
        <FlatList
          data={paginatedProducts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 120 : 100,
            paddingHorizontal: 2
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

        <View className="border-t border-slate-200 mt-5 mb-2" />

        <Pagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalRecords={pagination.totalRecords}
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