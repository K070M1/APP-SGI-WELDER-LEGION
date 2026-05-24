import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userCreateSchema, userUpdateSchema } from '../../schema';

export function useUserForm(idUsuario?: string, initialData?: any) {
  const isEditing = !!idUsuario;

  const form = useForm<any>({
    resolver: zodResolver(isEditing ? userUpdateSchema : userCreateSchema),
    defaultValues: {
      nombre_usuario: initialData?.nombre_usuario || '',
      correo: initialData?.correo || '',
      id_rol: initialData?.id_rol || '',
      id_estado: initialData?.id_estado !== undefined ? initialData.id_estado : 1,
      clave: '',
      confirmar_clave: '',
    },
  });

  const onSubmit = (data: any) => {
    if (isEditing) {
      console.log('Actualizando usuario con ID:', idUsuario, data);
    } else {
      console.log('Creando nuevo usuario:', data);
    }
  };

  return {
    form,
    isEditing,
    onSubmit,
  };
}