import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { Text } from '@/shared/components/ui/text';
import * as React from 'react';
import { Pressable, type TextInput, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { useAuth } from '@/shared/hooks/use-auth';
import { userService } from '@/api/user/user.service';
import { ROUTES } from '@/navigation/routes';

export function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const auth = getAuth();
  const { login } = useAuth();
  const navigation = useNavigation<any>();

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Autenticar con Firebase
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (res.user) {
        const firebaseUser = res.user;
        const token = await firebaseUser.getIdToken();

        // 2. Obtener datos del usuario desde InsForge DB
        try {
          const userData = await userService.getUserByUuid(firebaseUser.uid);

          // 3. Guardar en el store de Zustand con datos completos
          login(
            {
              id: userData.id, // UUID de InsForge (el ID real de la tabla)
              firebaseUid: firebaseUser.uid, // UID de Firebase Auth
              email: userData.correo,
              nombreUsuario: userData.nombre_usuario,
              rol: userData.rol,
              perfil: userData.perfil,
            },
            token
          );
        } catch (dbError: any) {
          // Si no se encuentra en la BD, usar solo datos de Firebase
          login(
            {
              id: firebaseUser.uid, // Temporal: usar Firebase UID hasta que se cree en DB
              firebaseUid: firebaseUser.uid,
              email: firebaseUser.email || '',
              nombreUsuario: firebaseUser.displayName || undefined,
            },
            token
          );
        }
      } else {
        Alert.alert('Error', 'Usuario no encontrado');
      }
    } catch (error: any) {
      let errorMessage = 'Ocurrió un error al iniciar sesión';
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Correo o contraseña incorrectos';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos. Intenta más tarde';
      }

      Alert.alert('Error de autenticación', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="gap-6 w-full max-w-sm">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Inicio de sesión</CardTitle>
          <CardDescription className="text-center sm:text-left">
            ¡Bienvenido de nuevo!
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                placeholder="mi@correo.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                  onPress={() => {
                    navigation.navigate(ROUTES.AUTH.FORGOT_PASSWORD);
                  }}>
                  <Text className="font-normal leading-4">¿Olvidaste tu contraseña?</Text>
                </Button>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                returnKeyType="send"
                placeholder='**************'
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              <Text>{isLoading ? 'Iniciando sesión...' : 'Continuar'}</Text>
            </Button>
          </View>
          <Text className="text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <Pressable
              onPress={() => {
                // TODO: Navigate to sign up screen
              }}>
              <Text className="text-sm underline underline-offset-4">Regístrate</Text>
            </Pressable>
          </Text>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">o</Text>
            <Separator className="flex-1" />
          </View>
        </CardContent>
      </Card>
    </View>
  );
}