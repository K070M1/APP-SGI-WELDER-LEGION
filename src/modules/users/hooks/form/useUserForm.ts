import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userService } from '@/api/user/user.service';
import { userCreateSchema, userUpdateSchema } from '../../schema';

export function useUserForm(idUsuario?: string, initialData?: any) {
  const isEditing = !!idUsuario;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(isEditing ? userUpdateSchema : userCreateSchema),
    defaultValues: {
      nombre_usuario: initialData?.nombre_usuario || '',
      correo: initialData?.correo || '',
      rol: initialData?.rol || '',
      estado: initialData?.estado !== undefined ? initialData.estado : 1,
      clave: '',
      confirmar_clave: '',
    },
  });

  // Cargar datos del usuario si estamos editando
  useEffect(() => {
    if (isEditing && idUsuario) {
      loadUserData();
    }
  }, [idUsuario, isEditing]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await userService.getUserById(idUsuario!);

      form.reset({
        nombre_usuario: userData.nombre_usuario,
        correo: userData.correo,
        rol: userData.rol,
        estado: userData.estado,
        clave: '',
        confirmar_clave: '',
      });
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: any) => {
    // Mostrar diálogo de confirmación
    const estadoTexto = data.estado === 1 ? 'Activo' : 'Inactivo';
    const mensaje = isEditing
      ? `¿Deseas actualizar este usuario?\n\nUsuario: ${data.nombre_usuario}\nCorreo: ${data.correo}\nRol: ${data.rol}\nEstado: ${estadoTexto}`
      : `¿Deseas crear este usuario?\n\nUsuario: ${data.nombre_usuario}\nCorreo: ${data.correo}\nRol: ${data.rol}\nEstado: ${estadoTexto}`;

    Alert.alert(
      isEditing ? 'Confirmar Actualización' : 'Confirmar Creación',
      mensaje,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => handleConfirmedSubmit(data),
        },
      ]
    );
  };

  const handleConfirmedSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      if (isEditing) {
        // Actualizar usuario existente
        await userService.updateUser(idUsuario!, {
          nombre_usuario: data.nombre_usuario,
          correo: data.correo,
          clave: data.clave, // ✅ Incluir contraseña si fue ingresada
          rol: data.rol,
          estado: data.estado,
        });

        Alert.alert('Éxito', 'Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        await userService.createUser({
          nombre_usuario: data.nombre_usuario,
          correo: data.correo,
          clave: data.clave,
          rol: data.rol,
          estado: data.estado,
        });

        Alert.alert(
          'Éxito',
          'Usuario registrado correctamente',
          [{ text: 'OK', onPress: () => form.reset() }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al procesar el formulario');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isEditing,
    onSubmit,
    isLoading,
  };
}