import "./global.css"
import { StatusBar, useColorScheme } from "react-native";
import { PortalHost } from '@rn-primitives/portal';
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";

// Stacks
import HomeScreen from "./stacks/HomeScreen";

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = { backgroundColor: isDarkMode ? DarkTheme.colors.background : DefaultTheme.colors.background, flex: 1 };

  const theme = {
    ...isDarkMode ? DarkTheme : DefaultTheme,
    colors: isDarkMode ? DarkTheme.colors : DefaultTheme.colors,
  };
  return (
    <ThemeProvider value={theme}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
      <HomeScreen />
      <PortalHost />
    </ThemeProvider>
  );
}