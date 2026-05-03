import "./global.css"
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, useColorScheme } from "react-native";
import { PortalHost } from '@rn-primitives/portal';
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";

// Stacks
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? DarkTheme.colors.background : DefaultTheme.colors.background, flex: 1 };

  const theme = {
    ...isDarkMode ? DarkTheme : DefaultTheme,
    colors: isDarkMode ? DarkTheme.colors : DefaultTheme.colors,
  };
  return (
    <ThemeProvider value={theme}>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
        <RootNavigator />
        <PortalHost />
      </NavigationContainer>
    </ThemeProvider>
  );
}