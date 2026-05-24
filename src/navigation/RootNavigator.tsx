import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos la lista de rutas
import { ROUTES } from './routes';

// Importamos el hook de autenticación
import { useAuth } from '@/shared/hooks/use-auth';

// Importamos las pantallas
import { MainTabs } from './MainTabs';
import { LoginScreen } from '@/modules/auth/screens/LoginScreen';
import { ProductFormScreen } from '@/modules/products/screens/FormScreen';
import { ProductDetailScreen } from '@/modules/products/screens/DetailScreen';
import { MovementFormScreen } from '@/modules/movements/screens/FormScreen';
import { MovementDetailScreen } from '@/modules/movements/screens/DetailScreen';
import { ScannerScreen } from '@/modules/scanner/screens/ScannerScreen';
import { ProfileScreen } from '@/modules/profile/screens/ProfileScreen';
import { UserListScreen } from '@/modules/users/screens/ListScreen';
import { UserFormScreen } from '@/modules/users/screens/FormScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  // Obtenemos el estado de autenticación desde el store de Zustand
  const { isAuthenticated, isLoading } = useAuth();

  // Mostramos un loader mientras se restaura el estado desde AsyncStorage
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // FLUJO NO AUTENTICADO
        <Stack.Screen name={ROUTES.AUTH.LOGIN} component={LoginScreen} />
      ) : (
        // FLUJO CONECTADO
        <>
          {/* 1. TABS PRINCIPALES (Base de la App) */}
          <Stack.Screen name={ROUTES.MAIN.TABS} component={MainTabs} />

          {/* 2. PANTALLAS APILADAS (Al abrirse, ocultan los Tabs) */}
          <Stack.Group>
            <Stack.Screen name={ROUTES.USERS.LIST} component={UserListScreen} />
            <Stack.Screen name={ROUTES.USERS.FORM} component={UserFormScreen} />

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