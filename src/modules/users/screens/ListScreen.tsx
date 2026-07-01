import React from 'react';
import { View, FlatList, TextInput, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, FilterIcon, Edit, Trash2, Mail, Shield, ToggleLeft, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Text } from '@/shared/components/ui/text';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/shared/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/shared/components/ui/dialog';
import { Pagination } from '@/shared/components/composed/pagination';

import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '@/shared/constants/filters';
import { ROUTES } from '@/navigation/routes';

import { useUserList } from '@/modules/users/hooks/list/useUserList';
import { UserGridCard } from '@/modules/users/components/user-list/UserGridCard';

export function UserListScreen() {
  const navigation = useNavigation<any>();

  const {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    selectedUser,
    isDetailOpen,
    setIsDetailOpen,
    handleOpenDetail,
    handleDeleteUser,
    handleClearFilters,
    loadUsers,
    pagination,
  } = useUserList();

  const handleEdit = (userId: string) => {
    navigation.navigate(ROUTES.USERS.FORM, { id: userId });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* Cabecera, Título y Filtros - FIJOS */}
      <View className="flex-1 px-4 pt-4">

        {/* Cabecera y Título */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-extrabold text-[#333333] leading-tight">USUARIOS</Text>
            <Text className="text-sm text-[#999999] font-medium mt-1">Personal de la Legión</Text>
          </View>
          <Button
            className="rounded-2xl shadow-sm px-4 flex-row items-center bg-[#748FFC]"
            onPress={() => navigation.navigate(ROUTES.USERS.FORM)}
          >
            <Icon as={Plus} className="size-5 text-white mr-2" />
            <Text className="text-white font-bold text-sm">Nuevo</Text>
          </Button>
        </View>

        {/* Contenedor de Filtros Avanzados */}
        <View className="mb-6 gap-3">
          <View className="flex-row items-center bg-white border border-[#E8E8E8] rounded-xl px-4">
            <Icon as={Search} className="size-5 text-[#999999]" />
            <TextInput
              placeholder="Buscar por nombre, apellido o correo..."
              placeholderTextColor="#999999"
              className="flex-1 ml-3 text-sm text-[#333333] font-medium h-10"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1">
              <Select value={roleFilter} onValueChange={(opt) => setRoleFilter(opt as any)}>
                <SelectTrigger className="rounded-xl bg-white border border-[#E8E8E8] h-10">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent align="start" sideOffset={8} className="w-56 rounded-xl border-[#E8E8E8]">
                  <SelectGroup>
                    <SelectLabel><Text className="font-bold text-[#333333]">Roles</Text></SelectLabel>
                    {USER_ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} label={opt.label}><Text>{opt.label}</Text></SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            <View className="flex-1">
              <Select value={statusFilter} onValueChange={(opt) => setStatusFilter(opt as any)}>
                <SelectTrigger className="rounded-xl bg-white border border-[#E8E8E8] h-10">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent align="end" sideOffset={8} className="w-56 rounded-xl border-[#E8E8E8]">
                  <SelectGroup>
                    <SelectLabel><Text className="font-bold text-[#333333]">Estado</Text></SelectLabel>
                    {USER_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} label={opt.label}><Text>{opt.label}</Text></SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>
          </View>

          <View className="flex-row gap-2 mt-1">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-[#E8E8E8] h-10 flex-row items-center justify-center bg-white"
              onPress={handleClearFilters}
              disabled={isLoading}
            >
              <Icon as={FilterIcon} className="size-4 text-[#333333] mr-2" />
              <Text className="text-[#333333] font-bold text-xs">Limpiar</Text>
            </Button>
            <Button
              className="flex-1 rounded-xl h-10 flex-row items-center justify-center bg-[#748FFC]"
              onPress={loadUsers}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Icon as={Search} className="size-4 text-white mr-2" />
                  <Text className="text-white font-bold text-xs">Buscar</Text>
                </>
              )}
            </Button>
          </View>
        </View>

        {/* Grid de 2 Columnas - SCROLLABLE */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#748FFC" />
            <Text className="text-lg font-bold text-[#748FFC] mt-4 mb-2">Cargando usuarios...</Text>
            <Text className="text-sm text-[#999999]">Por favor espera</Text>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperClassName="justify-center"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom:
                Platform.OS === 'ios'
                  ? 120
                  : 100,
              paddingHorizontal: 2,
            }}
            scrollEnabled={true}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center">
                <Icon as={Search} size={64} className="text-[#E8E8E8] mb-4" />
                <Text className="text-lg font-bold text-[#999999] mb-2">No se encontraron usuarios</Text>
                <Text className="text-sm text-[#CCCCCC] text-center px-8">
                  {searchQuery || roleFilter.value !== 'all' || statusFilter.value !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Aún no hay usuarios registrados en el sistema'}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <UserGridCard
                user={item}
                onPress={() => handleOpenDetail(item)}
                onEdit={handleEdit}
                onDelete={handleDeleteUser}
              />
            )}
          />
        )}

        <View className="border-t border-slate-200 mt-5 mb-2" />

        {/* Paginación - FIJA en el FOOTER */}
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


      {/* DIALOG SINGLETON: DETALLE DE USUARIO */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="w-[410px] bg-white rounded-[32px] p-6" showClose={false}>
          <DialogHeader className="items-center">
            <DialogTitle className="text-2xl font-extrabold text-[#333333] mt-2">
              Perfil de Usuario
            </DialogTitle>
            <DialogDescription className="text-sm text-[#999999] text-center mt-0.5">
              Ficha del colaborador en el SGI
            </DialogDescription>
          </DialogHeader>

          {/* Cuerpo del Detalle */}
          <View className="gap-3 py-4 mt-2">
            <View className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E8E8E8]">
              <Text className="text-[10px] font-bold text-[#999999] tracking-wider uppercase mb-1">Nombre de Usuario</Text>
              <Text className="text-base font-bold text-[#333333]">{selectedUser?.nombre_usuario}</Text>
            </View>

            <View className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E8E8E8] flex-row items-center gap-3">
              <Icon as={Mail} size={18} className="text-[#748FFC]" />
              <View className="flex-1">
                <Text className="text-[10px] font-bold text-[#999999] tracking-wider uppercase">Correo Electrónico</Text>
                <Text className="text-sm font-medium text-[#333333]" numberOfLines={1}>{selectedUser?.correo}</Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              <View className="flex-1 bg-[#F8FAFC] p-3 rounded-2xl border border-[#E8E8E8] flex-row items-center gap-2">
                <Icon as={Shield} size={16} className="text-[#748FFC]" />
                <View>
                  <Text className="text-[10px] font-bold text-[#999999] tracking-wider uppercase">Rol</Text>
                  <Text className="text-xs font-bold text-[#333333]">{selectedUser?.rol}</Text>
                </View>
              </View>

              <View className="flex-1 bg-[#F8FAFC] p-3 rounded-2xl border border-[#E8E8E8] flex-row items-center gap-2">
                <Icon as={ToggleLeft} size={16} className={selectedUser?.estado === 1 ? 'text-emerald-500' : 'text-slate-400'} />
                <View>
                  <Text className="text-[10px] font-bold text-[#999999] tracking-wider uppercase">Estado</Text>
                  <Text className="text-xs font-bold text-[#333333]">{selectedUser?.estado === 1 ? 'Activo' : 'Inactivo'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Acciones: Cerrar, Editar, Eliminar */}
          <View className="flex-row gap-3 mt-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="flex-1 border-[#E8E8E8] h-11 rounded-xl flex-row items-center justify-center bg-white"
              >
                <Text className="text-[#333333] font-bold text-xs">Cerrar</Text>
              </Button>
            </DialogClose>

            <Button
              variant="outline"
              className="flex-1 border-[#E8E8E8] h-11 rounded-xl flex-row items-center justify-center bg-white"
              onPress={() => {
                setIsDetailOpen(false);
                navigation.navigate(ROUTES.USERS.FORM, { id: selectedUser?.id });
              }}
            >
              <Icon as={Edit} size={16} className="text-[#333333] mr-2" />
              <Text className="text-[#333333] font-bold text-xs">Editar</Text>
            </Button>

            <Button
              className="flex-1 bg-[#FF8787] h-11 rounded-xl flex-row items-center justify-center"
              onPress={() => {
                if (selectedUser?.id) {
                  setIsDetailOpen(false);
                  handleDeleteUser(selectedUser.id);
                }
              }}
            >
              <Icon as={Trash2} size={16} className="text-white mr-2" />
              <Text className="text-white font-bold text-xs">Eliminar</Text>
            </Button>
          </View>
        </DialogContent>
      </Dialog>

    </SafeAreaView>
  );
}