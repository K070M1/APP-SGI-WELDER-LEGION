import { createClient } from '@insforge/sdk';

// Crear cliente de InsForge para React Native
export const insforge = createClient({
  baseUrl: process.env.INSFORGE_URL,
  anonKey: process.env.INSFORGE_ANON_KEY
});
