import "./global.css"
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from "react-native";
import { PortalHost } from '@rn-primitives/portal';
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { ROUTES } from 'src/navigation/routes';

// Stacks
import { RootNavigator } from '@/navigation/RootNavigator';
import { UiOverlayProvider } from '@/shared/contexts/UiOverlayContext';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? DarkTheme.colors.background : DefaultTheme.colors.background, flex: 1 };

  const theme = {
    ...isDarkMode ? DarkTheme : DefaultTheme,
    colors: isDarkMode ? DarkTheme.colors : DefaultTheme.colors,
  };
  const linking = {
    prefixes: [Linking.createURL('/'), 'sgiwelderlegion://'],
    config: {
      screens: {
        [ROUTES.PRODUCTS.DETAIL]: 'product/:id',
      },
    },
  };

  return (
    <ThemeProvider value={theme}>
      <NavigationContainer linking={linking}>
        <UiOverlayProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
          <RootNavigator />
          <PortalHost />
        </UiOverlayProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}