import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Package, ArrowLeftRight, Users, UserCircleIcon, LayoutDashboard } from 'lucide-react-native';

import { ROUTES } from './routes';
import { ProductListScreen } from '@/modules/products/screens/ListScreen';
import { MovementListScreen } from '@/modules/movements/screens/ListScreen';
import { UserListScreen } from '@/modules/users/screens/ListScreen';
import { DashboardScreen } from '@/modules/dashboard/screens/DashboardScreen';

import { UserMenu } from '@/shared/components/composed/user-menu';
import { Icon } from '@/shared/components/ui/icon';

import { useAuth } from '@/shared/hooks/use-auth';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  // Obtenemos los márgenes de seguridad del celular (notch y barra inferior)
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

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
      {
        // Solo ADMIN, ALMACENERO y OPERARIO pueden ver la pestaña de Productos
        (user?.rol === "ADMIN" || user?.rol === "ALMACENERO" || user?.rol === "OPERARIO") && (
          <Tab.Screen
            name={ROUTES.PRODUCTS.LIST}
            component={ProductListScreen}
            options={{
              tabBarLabel: 'PRODUCTOS',
              tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
            }}
          />
        )
      }

      {/* 2. MOVIMIENTOS */}
      {
        // Solo ADMIN y ALMACENERO pueden ver la pestaña de Movimientos
        (user?.rol === "ADMIN" || user?.rol === "ALMACENERO") && (
          <Tab.Screen
            name={ROUTES.MOVEMENTS.LIST}
            component={MovementListScreen}
            options={{
              tabBarLabel: 'MOVIMIENTOS',
              tabBarIcon: ({ color, size }) => <ArrowLeftRight color={color} size={size} />,
            }}
          />
        )
      }

      {/* 3. DASHBOARD (CENTRAL) */}
      <Tab.Screen
        name={ROUTES.DASHBOARD.LIST}
        component={DashboardScreen}
        options={{
          tabBarButton: () => (
            <View className="flex-1 items-center justify-center">
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate(ROUTES.DASHBOARD.LIST as never)}
                className="-mt-8 bg-[#748FFC] rounded-full p-3.5 elevation-md shadow-lg shadow-blue-500/30"
              >
                <LayoutDashboard color="#ffffff" size={24} />
              </TouchableOpacity>
            </View>
          )
        }}
      />

      {/* 4. USUARIOS */}
      {
        // Solo ADMIN puede ver la pestaña de Usuarios
        (user?.rol === "ADMIN") && (
          <Tab.Screen
            name={ROUTES.USERS.LIST}
            component={UserListScreen}
            options={{
              tabBarLabel: 'USUARIOS',
              tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
            }}
          />
        )
      }

      {/* 5. CUENTA (Con Dropdown Menu) */}
      <Tab.Screen
        name="AccountMenu"
        component={View}
        options={{
          tabBarButton: () => (
            <View className="flex-1 items-center justify-center">
              <UserMenu>
                <Icon as={UserCircleIcon} className="size-6 text-[#8E8E93]" />
              </UserMenu>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}