import React, { useState } from 'react';
import { View, FlatList, TextInput, SafeAreaView, Platform } from 'react-native';
import { Search, Plus, FilterIcon, QrCode, Trash2, AlertCircleIcon, MoveLeftIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/shared/components/ui/select';
import { ProductCard } from '../components/product-list/ProductCard';
import type { ProductListItem } from '@/dtos/products/product.dto';

import { PRODUCT_STOCK_OPTIONS, PRODUCT_STATUS_OPTIONS } from '@/shared/constants/filters';
import { ROUTES } from '@/navigation/routes';

// Importamos los Modales
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

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
  const [products, setProducts] = useState<ProductListItem[]>(INITIAL_MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState({ value: 'all', label: 'Todos' });
  const [statusFilter, setStatusFilter] = useState({ value: 'all', label: 'Todos' });
  const [pageSize, setPageSize] = useState({ value: '5', label: '5' });
  const [currentPage, setCurrentPage] = useState(1);

  // --- ESTADOS PARA LOS MODALES ---
  const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // --- FUNCIONES DE FILTRO ---
  const handleSearch = () => {
    console.log('Buscando con:', { query: searchQuery, stock: stockFilter.value, status: statusFilter.value });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStockFilter({ value: 'all', label: 'Todos' });
    setStatusFilter({ value: 'all', label: 'Todos' });
    setProducts(INITIAL_MOCK_DATA);
    setCurrentPage(1);
  };

  const pageSizeNumber = Number(pageSize.value);
  const totalRecords = products.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSizeNumber));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedProducts = products.slice((currentPageSafe - 1) * pageSizeNumber, currentPageSafe * pageSizeNumber);
  const pageStart = totalRecords === 0 ? 0 : (currentPageSafe - 1) * pageSizeNumber + 1;
  const pageEnd = Math.min(totalRecords, currentPageSafe * pageSizeNumber);

  const handlePageSizeChange = (option: any) => {
    setPageSize(option as any);
    setCurrentPage(1);
  };

  const handlePrevPage = () => setCurrentPage(page => Math.max(1, page - 1));
  const handleNextPage = () => setCurrentPage(page => Math.min(totalPages, page + 1));

  // --- FUNCIONES DE MOCK DE STOCK ---
  const handleIncrementStock = (id_producto: string) => {
    setProducts(prev => prev.map(p => p.id_producto === id_producto ? { ...p, stock: p.stock + 1 } : p));
  };

  const handleDecrementStock = (id_producto: string) => {
    setProducts(prev => prev.map(p => p.id_producto === id_producto && p.stock > 0 ? { ...p, stock: p.stock - 1 } : p));
  };

  // --- FUNCIONES DE MODALES ---
  const handleOpenQR = (product: ProductListItem) => {
    setSelectedProduct(product);
    setIsQRModalOpen(true);
  };

  const handleOpenDelete = (id_producto: string) => {
    const product = products.find(p => p.id_producto === id_producto);
    if (product) {
      setSelectedProduct(product);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts(prev => prev.filter(p => p.id_producto !== selectedProduct.id_producto));
      setIsDeleteModalOpen(false);
      setTimeout(() => setSelectedProduct(null), 300);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <View className="flex-1 px-4 pt-20">

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
              onDelete={handleOpenDelete}
              onQR={() => handleOpenQR(item)}
            />
          )}
        />

        <View className="border-t border-slate-800 my-3" />

        <View className="flex-row grid grid-cols-6 items-center justify-around w-full gap-5">

          {/* Bloque 1: Mostrar (Ocupa 2 columnas) */}
          <View className="col-span-3 flex-row items-center gap-2">
            <Text className="text-sm font-medium text-slate-600">Mostrar</Text>
            <Select value={pageSize} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-24 rounded-xl bg-white border border-slate-200 h-10">
                <SelectValue placeholder="5" />
              </SelectTrigger>
              <SelectContent align="start" sideOffset={8} className="w-28 rounded-xl border-slate-100">
                <SelectGroup>
                  <SelectLabel>
                    <Text className="font-bold text-slate-900">Registros</Text>
                  </SelectLabel>
                  {[5, 10, 15, 20].map((size) => (
                    <SelectItem key={size} value={String(size)} label={String(size)}>
                      <Text>{size}</Text>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>

          {/* Bloque 2: Botones de paginación (Ocupa 2 columnas) */}
          <View className="col-span-2 flex-row items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-10 px-3 flex-row items-center justify-center border-0 shadow-sm bg-white"
              onPress={handlePrevPage}
            >
              <Text className="text-slate-600 font-bold">&lt;</Text>
            </Button>

            <View className="rounded-xl bg-slate-100 h-10 px-4 flex-row items-center justify-center shadow-sm">
              <Text className="text-slate-900 font-bold">{String(currentPageSafe).padStart(2, '0')}</Text>
            </View>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-10 px-3 flex-row items-center justify-center border-0 shadow-sm bg-white"
              onPress={handleNextPage}
            >
              <Text className="text-slate-600 font-bold">&gt;</Text>
            </Button>
          </View>

        </View>

        {/* Bloque 3: Texto centrado abajo */}
        <View className="w-full items-center justify-center mt-1 mb-3">
          <Text className="text-sm text-slate-600">
            {pageStart}-{pageEnd} de {totalRecords} registros
          </Text>
        </View>
      </View>

      {/* MODAL 1: CÓDIGO QR */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-[32px] p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-extrabold text-slate-900 mt-2">
              Código QR
            </DialogTitle>
            <DialogDescription className="text-center text-slate-500 text-sm mt-1 px-4">
              {selectedProduct?.nombre}
            </DialogDescription>
          </DialogHeader>

          <View className="items-center justify-center py-6">
            <View className="size-56 bg-slate-50 rounded-3xl border border-slate-200 items-center justify-center shadow-sm">
              <Icon as={QrCode} size={64} className="text-slate-300" />
              <Text className="text-slate-400 font-semibold mt-4 tracking-wider text-xs uppercase">
                {selectedProduct?.codigo}
              </Text>
            </View>
          </View>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CONFIRMACIÓN DE ELIMINAR */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className="bg-white rounded-[32px] p-6">
          <AlertDialogHeader className="items-center">
            <View className="mb-3">
              <Icon as={AlertCircleIcon} size={96} className="text-[#FF8787]" />
            </View>
            <AlertDialogTitle className="text-[#333333] font-extrabold text-2xl text-center">
              ¿Eliminar Producto?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 mt-2 text-base text-center leading-5 px-2">
              Producto: <Text className="font-bold text-[#333333] text-center">{selectedProduct?.nombre}</Text>
              {"\n"}Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 flex-row justify-center gap-4">
            <AlertDialogCancel
              className="flex rounded-xl bg-white border border-[#E8E8E8] flex-row items-center justify-center"
              onPress={() => setIsDeleteModalOpen(false)}
            >
              <Icon as={MoveLeftIcon} size={18} className="text-[#333333] mr-2" />
              <Text className="text-[#333333] font-bold bg-transparent border-0">Cancelar</Text>
            </AlertDialogCancel>

            <AlertDialogAction
              className="flex rounded-xl bg-[#FF8787] flex-row items-center justify-center"
              onPress={confirmDelete}
            >
              <Icon as={Trash2} size={18} className="text-white mr-2" />
              <Text className="text-white font-bold bg-transparent border-0">Eliminar</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </SafeAreaView >
  );
}