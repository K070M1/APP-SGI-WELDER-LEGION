import React from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Download, ArrowLeft, FileText, Calendar, User, Package } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

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

  if (isLoading || !movement) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8FAFC] justify-center items-center">
        <ActivityIndicator size="large" color="#748FFC" />
        <Text className="mt-4 text-[#999999] font-medium">Cargando detalle...</Text>
      </SafeAreaView>
    );
  }

  const isEntrada = movement.tipo === 'ENTRADA';
  const totalItems = movement.detalles?.reduce((acc, d) => acc + (d.cantidad || 0), 0) || 0;
  const montoTotal = movement.detalles?.reduce((acc, d) => acc + ((d.cantidad || 0) * (d.precio_unitario || 0)), 0) || 0;

  const handleDownloadPDF = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; margin-bottom: 40px; }
              .title { font-size: 24px; font-weight: bold; color: #111; margin-bottom: 5px; }
              .subtitle { font-size: 14px; color: #666; }
              .info-box { border: 1px solid #e8e8e8; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
              .info-row { margin-bottom: 15px; }
              .info-label { font-size: 11px; font-weight: bold; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
              .info-value { font-size: 14px; font-weight: bold; color: #333; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th { text-align: left; padding: 12px; border-bottom: 2px solid #e8e8e8; font-size: 12px; color: #999; text-transform: uppercase; }
              td { padding: 12px; border-bottom: 1px solid #e8e8e8; font-size: 14px; color: #333; }
              .total-box { background-color: #333; color: white; border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; }
              .total-label { font-size: 14px; font-weight: bold; letter-spacing: 1px; }
              .total-value { font-size: 24px; font-weight: bold; color: #748FFC; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">COMPROBANTE DE MOVIMIENTO</div>
              <div class="subtitle">Mov-${movement.id.slice(0, 8).toUpperCase()} - ${movement.tipo}</div>
            </div>
            
            <div class="info-box">
              <div class="info-row">
                <div class="info-label">Motivo / Entidad</div>
                <div class="info-value">${movement.motivo || movement.tipo}</div>
                <div style="font-size: 12px; color: #666; margin-top: 2px;">${movement.cliente || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Fecha de Emisión</div>
                <div class="info-value">${new Date(movement.fechaRegistro).toLocaleString()}</div>
              </div>
              <div class="info-row" style="margin-bottom: 0;">
                <div class="info-label">Registrado Por</div>
                <div class="info-value">${movement.usuarioNombre}</div>
              </div>
            </div>

            <div class="info-label" style="margin-bottom: 10px; color: #333;">Productos Involucrados</div>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>P. Unit</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${movement.detalles.map(d => `
                  <tr>
                    <td><strong style="font-size:12px">${d.codigo_producto}</strong></td>
                    <td>${d.nombre_producto}</td>
                    <td><strong>${d.cantidad}</strong></td>
                    <td>S/ ${(d.precio_unitario || 0).toFixed(2)}</td>
                    <td><strong>S/ ${((d.cantidad || 0) * (d.precio_unitario || 0)).toFixed(2)}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total-box">
              <span class="total-label">VALOR TOTAL</span>
              <span class="total-value">S/ ${montoTotal.toFixed(2)}</span>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
    }
  };

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
              <Text className="text-2xl font-extrabold text-[#333333] tracking-tight">Mov-{movement.id.slice(0, 8).toUpperCase()}</Text>
              <Text className="text-xs font-bold text-[#999999] uppercase mt-1">Código de Registro</Text>
            </View>
            <Badge variant="default" className={`rounded-lg px-3 py-1 border shadow-sm ${isEntrada ? 'bg-emerald-100 border-emerald-200' : 'bg-orange-100 border-orange-200'}`}>
              <Text className={`text-[10px] font-bold tracking-wider uppercase ${isEntrada ? 'text-emerald-700' : 'text-orange-700'}`}>
                {movement.tipo}
              </Text>
            </Badge>
          </View>

          <View className="border-t border-dashed border-[#E8E8E8] my-4" />

          <View className="gap-5">
            <View className="flex-row items-start gap-4">
              <View className="mt-0.5">
                <Icon as={FileText} size={20} className="text-[#748FFC]" />
              </View>
              <View>
                <Text className="text-[11px] font-bold text-[#999999] uppercase tracking-wider mb-1">Motivo / Entidad</Text>
                <Text className="text-sm font-bold text-[#333333] uppercase">{movement.motivo || movement.tipo}</Text>
                {movement.cliente && (
                  <Text className="text-sm text-[#333333] mt-0.5">{movement.cliente}</Text>
                )}
              </View>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="mt-0.5">
                <Icon as={Calendar} size={20} className="text-[#748FFC]" />
              </View>
              <View>
                <Text className="text-[11px] font-bold text-[#999999] uppercase tracking-wider mb-1">Fecha de Emisión</Text>
                <Text className="text-sm font-medium text-[#333333]">
                  {new Date(movement.fechaRegistro).toLocaleString('es-PE', { 
                    day: '2-digit', month: 'short', year: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                  })}
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="mt-0.5">
                <Icon as={User} size={20} className="text-[#748FFC]" />
              </View>
              <View>
                <Text className="text-[11px] font-bold text-[#999999] uppercase tracking-wider mb-1">Registrado Por</Text>
                <Text className="text-sm font-medium text-[#333333]">{movement.usuarioNombre}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SECCIÓN 2: PRODUCTOS INVOLUCRADOS */}
        <Text className="text-sm font-bold text-[#333333] mb-4 uppercase tracking-wider">Productos ({totalItems} en total)</Text>

        <View className="mb-6 gap-3">
          {movement.detalles?.map((item) => (
            <View key={item.id_detalle || item.id_producto} className="bg-white p-4 rounded-3xl border border-[#E8E8E8] flex-row items-center shadow-sm">
              <View className="size-12 bg-[#F8FAFC] border border-[#E8E8E8] rounded-2xl items-center justify-center mr-4">
                <Icon as={Package} size={20} className="text-[#748FFC]" />
              </View>

              <View className="flex-1 mr-2">
                <Text className="font-bold text-[#333333] text-[13px] mb-1">{item.nombre_producto}</Text>
                <Text className="text-[11px] text-[#999999] font-medium uppercase tracking-wider">{item.codigo_producto}</Text>
              </View>

              <View className="items-end">
                <Text className="font-extrabold text-[#333333] text-sm">{item.cantidad} UND</Text>
                <Text className="text-[10px] font-medium text-[#999999] mt-1">S/ {((item.cantidad || 0) * (item.precio_unitario || 0)).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SECCIÓN 3: TOTALES */}
        <View className="bg-[#2B2B2B] p-5 rounded-[28px] mb-8 flex-row justify-between items-center shadow-md h-20">
          <Text className="text-white font-bold tracking-wider text-sm">VALOR TOTAL</Text>
          <Text className="text-2xl font-extrabold text-[#748FFC]">
            S/ {montoTotal.toFixed(2)}
          </Text>
        </View>

        {/* BOTONES DE ACCIÓN */}
        <View className="flex-row gap-3">
          <Button
            variant="outline"
            onPress={() => navigation.goBack()}
            className="flex-1 h-14 rounded-2xl bg-white border border-[#E8E8E8] flex-row items-center justify-center shadow-sm"
          >
            <Icon as={ArrowLeft} size={20} className="text-[#333333] mr-2" />
            <Text className="text-[#333333] font-bold text-[15px]">Volver</Text>
          </Button>

          <Button
            onPress={handleDownloadPDF}
            className="flex-1 bg-[#748FFC] h-14 rounded-2xl flex-row items-center justify-center shadow-sm"
          >
            <Icon as={Download} size={20} className="text-white mr-2" />
            <Text className="text-white font-bold text-[15px]">Descargar PDF</Text>
          </Button>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}