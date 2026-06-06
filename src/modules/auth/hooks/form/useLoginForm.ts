import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/modules/auth/schema';

export function useLoginForm() {
  // Inicializamos React Hook Form con nuestro esquema de Zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      correo: '',
      contrasena: '',
    },
    // Valida los campos a medida que el usuario escribe, ideal para móviles
    mode: 'onChange',
  });

  // Esta función se ejecutará SOLO si las validaciones de Zod pasan
  const onSubmit = async (values: LoginFormValues) => {
    try {
      // TODO: Aquí inyectaremos el llamado a auth.service.ts
      // await authService.login(values);

      // Simulamos una petición de red temporalmente
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    form,
    submit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
  };
}