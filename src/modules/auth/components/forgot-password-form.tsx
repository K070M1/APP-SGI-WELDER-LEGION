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
import { Text } from '@/shared/components/ui/text';
import { View, Alert } from 'react-native';
import React from 'react';
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@/navigation/routes';

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const auth = getAuth();
  const navigation = useNavigation<any>();

  async function onSubmit() {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        'Correo enviado',
        'Se ha enviado un correo con instrucciones para restablecer tu contraseña.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate(ROUTES.AUTH.LOGIN),
          },
        ]
      );
    } catch (error: any) {
      let errorMessage = 'Ocurrió un error al enviar el correo';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo electrónico';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos. Intenta más tarde';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="gap-6 w-full max-w-sm">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
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
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              <Text>{isLoading ? 'Enviando...' : 'Enviar correo de recuperación'}</Text>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onPress={() => navigation.navigate(ROUTES.AUTH.LOGIN)}
              disabled={isLoading}
            >
              <Text>Volver al inicio de sesión</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}