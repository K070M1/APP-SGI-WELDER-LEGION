import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos la lista de rutas
import { ROUTES } from './routes';

// Importamos las pantallas
import { MainTabs } from './MainTabs';
import { LoginScreen } from '@/modules/auth/screens/LoginScreen';
import { ProductFormScreen } from '@/modules/products/screens/FormScreen';
import { ProductDetailScreen } from '@/modules/products/screens/DetailScreen';
import { MovementFormScreen } from '@/modules/movements/screens/FormScreen';
import { MovementDetailScreen } from '@/modules/movements/screens/DetailScreen';
import { ScannerScreen } from '@/modules/scanner/screens/ScannerScreen';
import { ProfileScreen } from '@/modules/profile/screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  // Cuando integremos Zustand, este valor vendrá del store de autenticación
  const isAuthenticated = true;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // FLUJO DESCONECTADO
        <Stack.Screen name={ROUTES.AUTH.LOGIN} component={LoginScreen} />
      ) : (
        // FLUJO CONECTADO
        <>
          {/* 1. TABS PRINCIPALES (Base de la App) */}
          <Stack.Screen name={ROUTES.MAIN.TABS} component={MainTabs} />

          {/* 2. PANTALLAS APILADAS (Al abrirse, ocultan los Tabs) */}
          <Stack.Group>
            <Stack.Screen name={ROUTES.PRODUCTS.FORM} component={ProductFormScreen} />
            <Stack.Screen name={ROUTES.PRODUCTS.DETAIL} component={ProductDetailScreen} />

            <Stack.Screen name={ROUTES.MOVEMENTS.FORM} component={MovementFormScreen} />
            <Stack.Screen name={ROUTES.MOVEMENTS.DETAIL} component={MovementDetailScreen} />

            <Stack.Screen name={ROUTES.PROFILE.MAIN} component={ProfileScreen} />
          </Stack.Group>

          {/* 3. MODALES / CÁMARA (Opcional: podemos darle animaciones distintas a este grupo) */}
          <Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
            <Stack.Screen name={ROUTES.SCANNER.CAMERA} component={ScannerScreen} />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
}