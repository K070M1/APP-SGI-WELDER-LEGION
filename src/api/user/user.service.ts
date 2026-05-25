/**
 * User Service
 * Centraliza toda la lógica de llamadas API para usuarios
 */

import { insforge } from '@/lib/insforge';
import { getAuth, createUserWithEmailAndPassword, deleteUser as firebaseDeleteUser } from '@react-native-firebase/auth';
import type { UserListItem } from '@/dtos/users/user.dto';
import type { UserCreateDto } from '@/dtos/users/user.create.dto';
import type { UserUpdateDto } from '@/dtos/users/user.update.dto';
import type { UserFilters } from '@/dtos/users/user.filters.dto';

export class UserService {

  async getUsers(filters: UserFilters) {
    try {
      let query = insforge.database
        .from('usuario')
        .select('*');

      // Aplicar filtros
      if (filters.buscar) {
        query = query.or(`nombreUsuario.ilike.%${filters.buscar}%,correo.ilike.%${filters.buscar}%`);
      }

      if (filters.rol && filters.rol !== 'all') {
        query = query.eq('rol', filters.rol);
      }

      if (filters.estado && filters.estado !== 'all') {
        const estadoValue = filters.estado === 'active' ? 1 : 0;
        query = query.eq('estado', estadoValue);
      }

      // Ordenar por fecha de creación descendente
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Mapear a formato esperado
      const users: UserListItem[] = (data || []).map((user: any) => ({
        id: user.id,
        nombre_usuario: user.nombreUsuario,
        correo: user.correo,
        rol: user.rol,
        estado: user.estado,
        uuid: user.uuid,
        perfil: user.perfil,
      }));

      return {
        data: users,
        total: users.length,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const { data, error } = await insforge.database
        .from('usuario')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Usuario no encontrado');
      }

      return {
        id: data.id,
        nombre_usuario: data.nombreUsuario,
        correo: data.correo,
        rol: data.rol,
        estado: data.estado,
        uuid: data.uuid,
        perfil: data.perfil,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async getUserByUuid(uuid: string) {
    try {
      const { data, error } = await insforge.database
        .from('usuario')
        .select('*')
        .eq('uuid', uuid)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Usuario no encontrado');
      }

      return {
        id: data.id,
        nombre_usuario: data.nombreUsuario,
        correo: data.correo,
        rol: data.rol,
        estado: data.estado,
        uuid: data.uuid,
        perfil: data.perfil,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async createUser(payload: UserCreateDto) {
    const auth = getAuth();

    try {
      // 1. Registrar en Firebase Auth (Firebase maneja la contraseña)
      const firebaseUserCredential = await createUserWithEmailAndPassword(
        auth,
        payload.correo,
        payload.clave
      );
      const firebaseUserId = firebaseUserCredential.user.uid;

      // 2. Guardar datos en la tabla usuario de InsForge (sin contraseña)
      const { error: dbError } = await insforge.database
        .from('usuario')
        .insert([{
          nombreUsuario: payload.nombre_usuario,
          correo: payload.correo,
          uuid: firebaseUserId,
          rol: payload.rol,
          estado: payload.estado,
          perfil: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (dbError) {
        throw new Error(`Error guardando en BD: ${dbError.message}`);
      }

      return {
        success: true,
        message: 'Usuario registrado correctamente',
        firebaseUserId
      };
    } catch (error: any) {
      // Mapear errores de Firebase a mensajes amigables
      let errorMessage = 'Error al crear el usuario';
      if (error.message.includes('BD')) {
        errorMessage = 'Error al guardar en la base de datos: ' + error.message;
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ya está registrado';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido';
      } else {
        errorMessage = error.message || errorMessage;
      }

      throw new Error(errorMessage);
    }
  }

  async updateUser(id: string, payload: UserUpdateDto) {
    try {
      // 1. Obtener el UUID de Firebase del usuario
      const { data: userData, error: getUserError } = await insforge.database
        .from('usuario')
        .select('uuid')
        .eq('id', id)
        .single();

      if (getUserError) {
        throw new Error(`Error obteniendo usuario: ${getUserError.message}`);
      }

      if (!userData || !userData.uuid) {
        throw new Error('Usuario no encontrado o sin UUID de Firebase');
      }

      // 2. Si hay una nueva contraseña, actualizarla en Firebase
      if (payload.clave && payload.clave.trim() !== '') {
        try {
          const response = await insforge.functions.invoke('update-firebase-password', {
            body: {
              userId: userData.uuid,
              newPassword: payload.clave,
            },
          });

          // Verificar si hay error en la respuesta
          if (response.error) {
            const errorMsg = typeof response.error === 'string'
              ? response.error
              : response.error.message || JSON.stringify(response.error);
            throw new Error(`Firebase Admin: ${errorMsg}`);
          }

          // Verificar si la respuesta tiene data con error
          if (response.data && response.data.error) {
            throw new Error(`Firebase Admin: ${response.data.error}`);
          }
        } catch (firebaseError: any) {
          throw new Error(`Error al actualizar la contraseña: ${firebaseError.message}`);
        }
      }

      // 3. Actualizar datos en InsForge DB (excepto la contraseña)
      const updateData: any = {
        nombreUsuario: payload.nombre_usuario,
        correo: payload.correo,
        rol: payload.rol,
        estado: payload.estado,
        updated_at: new Date().toISOString(),
      };

      const { error } = await insforge.database
        .from('usuario')
        .update(updateData)
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      const message = payload.clave
        ? 'Usuario y contraseña actualizados correctamente'
        : 'Usuario actualizado correctamente';

      return { success: true, message };
    } catch (error: any) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      // 1. Obtener el usuario para conseguir su UUID de Firebase
      const { data: userData, error: getUserError } = await insforge.database
        .from('usuario')
        .select('uuid')
        .eq('id', id)
        .single();

      if (getUserError) {
        throw new Error(`Error obteniendo usuario: ${getUserError.message}`);
      }

      if (!userData || !userData.uuid) {
        throw new Error('Usuario no encontrado o sin UUID de Firebase');
      }

      // 2. Eliminar de la base de datos de InsForge
      const { error: deleteDbError } = await insforge.database
        .from('usuario')
        .delete()
        .eq('id', id);

      if (deleteDbError) {
        throw new Error(`Error eliminando de BD: ${deleteDbError.message}`);
      }

      return { success: true, message: 'Usuario eliminado correctamente' };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Actualiza el perfil del usuario autenticado
   * @param userId - ID del usuario autenticado
   * @param data - Datos del perfil a actualizar
   */
  async updateProfile(userId: string, data: {
    nombre_usuario?: string;
    perfil?: string; // URL de la imagen de perfil
    clave?: string; // Nueva contraseña (opcional)
  }) {
    try {
      // 1. Si hay contraseña, obtener UUID para actualizar en Firebase
      if (data.clave && data.clave.trim() !== '') {
        const { data: userData, error: getUserError } = await insforge.database
          .from('usuario')
          .select('uuid')
          .eq('id', userId)
          .single();

        if (getUserError) {
          throw new Error(`Error obteniendo usuario: ${getUserError.message}`);
        }

        if (!userData || !userData.uuid) {
          throw new Error('Usuario no encontrado');
        }

        // Actualizar contraseña en Firebase
        try {
          const response = await insforge.functions.invoke('update-firebase-password', {
            body: {
              userId: userData.uuid,
              newPassword: data.clave,
            },
          });

          if (response.error) {
            const errorMsg = typeof response.error === 'string'
              ? response.error
              : response.error.message || JSON.stringify(response.error);
            throw new Error(`Firebase Admin: ${errorMsg}`);
          }

          if (response.data && response.data.error) {
            throw new Error(`Firebase Admin: ${response.data.error}`);
          }
        } catch (firebaseError: any) {
          throw new Error(`Error al actualizar la contraseña: ${firebaseError.message}`);
        }
      }

      // 2. Actualizar datos en InsForge DB
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.nombre_usuario) {
        updateData.nombreUsuario = data.nombre_usuario;
      }

      if (data.perfil !== undefined) {
        updateData.perfil = data.perfil;
      }

      const { error } = await insforge.database
        .from('usuario')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        throw new Error(error.message);
      }

      // 3. Obtener datos actualizados
      const updatedUser = await this.getUserById(userId);

      return {
        success: true,
        message: 'Perfil actualizado correctamente',
        data: updatedUser,
      };
    } catch (error: any) {
      throw error;
    }
  }
}

export const userService = new UserService();
