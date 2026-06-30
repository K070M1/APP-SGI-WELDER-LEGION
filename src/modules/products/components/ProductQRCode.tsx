import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Text } from '@/shared/components/ui/text';

interface ProductQRCodeProps {
  /** Valor codificado en el QR (ej. código SKU o ID del producto) */
  value: string;
  /** Nombre del producto mostrado debajo del QR */
  productName?: string;
  /** Tamaño en px del QR (por defecto 200) */
  size?: number;
  /** Color de fondo del contenedor (por defecto blanco) */
  backgroundColor?: string;
}

/**
 * Componente que genera y muestra el código QR de un producto.
 * Usa react-native-qrcode-svg que a su vez depende de react-native-svg.
 */
export function ProductQRCode({
  value,
  productName,
  size = 200,
  backgroundColor = '#FFFFFF',
}: ProductQRCodeProps) {
  if (!value) return null;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={value}
          size={size}
          color="#1A1A2E"
          backgroundColor={backgroundColor}
          enableLinearGradient
          linearGradient={['#748FFC', '#5C7CFA']}
          logoBorderRadius={8}
          quietZone={8}
        />
      </View>
      {productName ? (
        <Text style={styles.label} numberOfLines={2}>
          {productName}
        </Text>
      ) : null}
      <Text style={styles.sublabel}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#748FFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  qrWrapper: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  label: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    maxWidth: 220,
  },
  sublabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#888888',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
