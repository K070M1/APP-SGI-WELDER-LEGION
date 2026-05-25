import { useAuthStore, type User } from '@/api/auth/auth.store';

/**
 * Hook personalizado para manejar la autenticación
 * Usa Zustand con persistencia en AsyncStorage
 */
export function useAuth() {
    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
    } = useAuthStore();

    /**
     * Realiza el login del usuario
     * @param userData - Datos del usuario
     * @param authToken - Token de autenticación
     */
    const handleLogin = (userData: User, authToken: string) => {
        login(userData, authToken);
    };

    /**
     * Cierra la sesión del usuario
     */
    const handleLogout = () => {
        logout();
    };

    /**
     * Actualiza los datos del usuario actual
     * @param userData - Datos parciales a actualizar
     */
    const handleUpdateUser = (userData: Partial<User>) => {
        updateUser(userData);
    };

    return {
        // Estado
        user,
        token,
        isAuthenticated,
        isLoading,

        // Acciones
        login: handleLogin,
        logout: handleLogout,
        updateUser: handleUpdateUser,
    };
}
