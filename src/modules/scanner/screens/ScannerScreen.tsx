import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@/navigation/routes';

export function ScannerScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Cargando cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Se necesita permiso de cámara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    navigation.navigate(ROUTES.PRODUCTS.LIST, { codigoEscaneado: data });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Marco visual */}
      <View style={styles.overlay}>
        <View style={styles.frame} />
        <Text style={styles.hint}>Apunta al código QR del producto</Text>
      </View>

      {scanned && (
        <TouchableOpacity style={styles.resetButton} onPress={() => setScanned(false)}>
          <Text style={styles.buttonText}>Escanear de nuevo</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>✕ Cerrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' },
  text: { color: 'white', fontSize: 16, marginBottom: 16, textAlign: 'center', paddingHorizontal: 24 },
  overlay: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  frame: { width: 220, height: 220, borderWidth: 3, borderColor: '#748FFC', borderRadius: 16, marginBottom: 20 },
  hint: { color: 'white', fontSize: 13, textAlign: 'center' },
  button: { backgroundColor: '#748FFC', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  resetButton: { position: 'absolute', bottom: 100, backgroundColor: '#748FFC', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  closeButton: { position: 'absolute', top: 60, right: 20, backgroundColor: '#333', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});