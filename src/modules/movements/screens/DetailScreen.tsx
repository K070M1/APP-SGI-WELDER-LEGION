import React from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Download, ArrowLeft, FileText, Calendar, User, Package } from 'lucide-react-native';

import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { Icon } from '@/shared/components/ui/icon';
import { Badge } from '@/shared/components/ui/badge';

import { useMovementDetail } from '../hooks/detail/useMovementDetail';

export function MovementDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const idMovimiento = route.params?.id || 'mov-desconocido';

  // Obtenemos los datos del movimiento usando nuestro hook
  const { movement, isLoading } = useMovementDetail(idMovimiento);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC] justify-center items-center">
        <ActivityIndicator size="large" color="#748FFC" />
        <Text className="mt-4 text-[#999999] font-medium">Cargando detalle...</Text>
      </SafeAreaView>
    );
  }

  const isEntrada = movement?.categoria === 'ENTRADA';

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      {/* CABECERA */}
      <View className="flex-row items-center px-4 pt-4 pb-4 bg-white border-b border-[#E8E8E8]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
          <Icon as={ChevronLeft} size={24} className="text-[#333333]" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#333333]">Detalle de Movimiento</Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* SECCIÓN 1: RESUMEN DEL MOVIMIENTO (TIPO VOUCHER) */}
        <View className="bg-white p-5 rounded-3xl border border-[#E8E8E8] shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-2xl font-extrabold text-[#333333] tracking-tight">{movement.codigo}</Text>
              <Text className="text-xs font-bold text-[#999999] uppercase mt-1">Código de Registro</Text>
            </View>
            <Badge variant="default" className={`rounded-lg px-3 py-1 border shadow-sm ${isEntrada ? 'bg-emerald-100 border-emerald-200' : 'bg-orange-100 border-orange-200'}`}>
              <Text className={`text-[10px] font-bold tracking-wider uppercase ${isEntrada ? 'text-emerald-700' : 'text-orange-700'}`}>
                {movement.categoria}
              </Text>
            </Badge>
          </View>

          <View className="border-t border-dashed border-[#E8E8E8] my-2" />

          <View className="gap-4 mt-3">
            <View className="flex-row items-center gap-3">
              <Icon as={FileText} size={18} className="text-[#748FFC]" />
              <View>
                <Text className="text-[10px] font-bold text-[#999999] uppercase tracking-wider">Motivo / Entidad</Text>
                <Text className="text-sm font-bold text-[#333333]">{movement.motivo}</Text>
                <Text className="text-xs text-[#333333] mt-0.5">{movement.entidad_relacionada}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <Icon as={Calendar} size={18} className="text-[#748FFC]" />
              <View>
                <Text className="text-[10px] font-bold text-[#999999] uppercase tracking-wider">Fecha de Emisión</Text>
                <Text className="text-sm font-medium text-[#333333]">{movement.fecha_movimiento}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3">
              <Icon as={User} size={18} className="text-[#748FFC]" />
              <View>
                <Text className="text-[10px] font-bold text-[#999999] uppercase tracking-wider">Registrado Por</Text>
                <Text className="text-sm font-medium text-[#333333]">{movement.usuario_creacion}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECCIÓN 2: PRODUCTOS INVOLUCRADOS */}
        <Text className="text-sm font-bold text-[#333333] mb-4 uppercase tracking-wider">Productos ({movement.cantidad_items} en total)</Text>

        <View className="mb-6 gap-2">
          {movement.items.map((item: any) => (
            <View key={item.id_producto} className="bg-white p-4 rounded-2xl border border-[#E8E8E8] flex-row items-center shadow-sm">
              <View className="size-10 bg-[#F8FAFC] border border-[#E8E8E8] rounded-xl items-center justify-center mr-3">
                <Icon as={Package} size={18} className="text-[#748FFC]" />
              </View>

              <View className="flex-1">
                <Text className="font-bold text-[#333333] text-sm" numberOfLines={1}>{item.nombre}</Text>
                <Text className="text-[10px] text-[#999999] font-medium mt-0.5">{item.codigo}</Text>
              </View>

              <View className="items-end ml-2">
                <Text className="font-extrabold text-[#333333]">{item.cantidad} UND</Text>
                <Text className="text-[10px] font-medium text-[#999999] mt-0.5">S/ {(item.cantidad * item.precio_unitario).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SECCIÓN 3: TOTALES */}
        <View className="bg-[#333333] p-5 rounded-3xl mb-8 flex-row justify-between items-center shadow-md">
          <Text className="text-white font-bold tracking-wider">VALOR TOTAL</Text>
          <Text className="text-2xl font-extrabold text-[#748FFC]">
            S/ {movement.monto_total.toFixed(2)}
          </Text>
        </View>

        {/* BOTONES DE ACCIÓN */}
        <View className="flex-row gap-3">
          <Button
            variant="outline"
            onPress={() => navigation.goBack()}
            className="flex-1 h-14 rounded-2xl bg-white border border-[#E8E8E8] flex-row items-center justify-center"
          >
            <Icon as={ArrowLeft} size={20} className="text-[#333333] mr-2" />
            <Text className="text-[#333333] font-bold text-base">Volver</Text>
          </Button>

          <Button
            onPress={() => {
              // TODO: Implementar descarga PDF
            }}
            className="flex-1 bg-[#748FFC] h-14 rounded-2xl flex-row items-center justify-center shadow-sm"
          >
            <Icon as={Download} size={20} className="text-white mr-2" />
            <Text className="text-white font-bold text-base">Descargar PDF</Text>
          </Button>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}