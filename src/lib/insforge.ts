import { createClient } from '@insforge/sdk';
import { INSFORGE_URL, INSFORGE_ANON_KEY } from '@env';

// Crear cliente de InsForge para React Native
export const insforge = createClient({
  baseUrl: INSFORGE_URL,
  anonKey: INSFORGE_ANON_KEY
});
