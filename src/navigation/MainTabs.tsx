import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Package, ArrowLeftRight, Users, UserCircle, Settings, LogOut, User } from 'lucide-react-native';

import { ROUTES } from './routes';
import { ProductListScreen } from '@/modules/products/screens/ListScreen';
import { MovementListScreen } from '@/modules/movements/screens/ListScreen';
import { UserListScreen } from '@/modules/users/screens/ListScreen';

// Componentes del Dropdown
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { UserMenu } from '@/shared/components/composed/user-menu';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  // Obtenemos los márgenes de seguridad del celular (notch y barra inferior)
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#748FFC', // Azul Aciano
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8E8E8',
          // Corrección clave de diseño:
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: 4,
        },
      }}
    >
      {/* 1. PRODUCTOS */}
      <Tab.Screen
        name={ROUTES.PRODUCTS.LIST}
        component={ProductListScreen}
        options={{
          tabBarLabel: 'PRODUCTOS',
          tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
        }}
      />

      {/* 2. MOVIMIENTOS */}
      <Tab.Screen
        name={ROUTES.MOVEMENTS.LIST}
        component={MovementListScreen}
        options={{
          tabBarLabel: 'MOVIMIENTOS',
          tabBarIcon: ({ color, size }) => <ArrowLeftRight color={color} size={size} />,
        }}
      />

      {/* 3. USUARIOS */}
      <Tab.Screen
        name={ROUTES.USERS.LIST}
        component={UserListScreen}
        options={{
          tabBarLabel: 'USUARIOS',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />

      {/* 4. CUENTA (Con Dropdown Menu) */}
      <Tab.Screen
        name={ROUTES.PROFILE.MAIN}
        component={View}
        options={{
          tabBarLabel: 'CUENTA',
          tabBarIcon: ({ color, size }) => <UserCircle color={color} size={size} />,
          tabBarButton: (props) => (
            <UserMenu
              onNavigateSettings={() => console.log('Navegando a configuración...')}
              onSignOut={() => console.log('Cerrando sesión...')}
            >
              <Pressable {...(props as any)} />
            </UserMenu>
          ),
        }}
      />
    </Tab.Navigator>
  );
}