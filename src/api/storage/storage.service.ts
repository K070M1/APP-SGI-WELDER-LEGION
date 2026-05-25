/**
 * Storage Service
 * Maneja la subida y gestión de archivos en InsForge Storage
 */

import { insforge } from '@/lib/insforge';

export class StorageService {
  /**
   * Sube una imagen de perfil a InsForge Storage
   * @param userId - ID del usuario
   * @param file - Archivo a subir (Blob, File o objeto con uri/type/name para React Native)
   * @returns URL y key de la imagen subida
   */
  async uploadProfileImage(userId: string, file: any): Promise<{ url: string; key: string }> {
    try {
      // Determinar si es un archivo de React Native (tiene uri) o un Blob/File
      const isReactNativeFile = file.uri !== undefined;

      // Generar ruta del archivo
      const fileName = isReactNativeFile ? file.name : `${userId}-${Date.now()}.jpg`;
      const filePath = `avatars/${fileName}`;

      // Subir a InsForge Storage en el bucket 'profile'
      // El SDK maneja automáticamente la conversión del objeto React Native
      const { data, error } = await insforge.storage
        .from('profile')
        .upload(filePath, file);

      if (error) {
        throw new Error(error.message || 'Error al subir la imagen');
      }

      if (!data) {
        throw new Error('No se recibieron datos de la subida');
      }

      // Construir la URL completa si no viene en la respuesta
      const url = data.url || `${process.env.INSFORGE_URL}/storage/v1/object/public/profile/${filePath}`;
      const key = data.key || filePath;

      return { url, key };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Elimina una imagen de perfil del storage
   * @param imageKey - Key de la imagen a eliminar
   */
  async deleteProfileImage(imageKey: string): Promise<void> {
    try {
      const { error } = await insforge.storage
        .from('profile')
        .remove(imageKey);

      if (error) {
        throw new Error(error.message || 'Error al eliminar la imagen');
      }
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Reemplaza una imagen de perfil existente
   * @param userId - ID del usuario
   * @param file - Nuevo archivo (Blob, File o objeto con uri/type/name para React Native)
   * @param oldImageKey - Key de la imagen anterior (opcional)
   */
  async replaceProfileImage(
    userId: string,
    file: any,
    oldImageKey?: string
  ): Promise<{ url: string; key: string }> {
    try {
      // Subir la nueva imagen
      const newImage = await this.uploadProfileImage(userId, file);

      // Eliminar la imagen anterior si existe
      if (oldImageKey) {
        try {
          await this.deleteProfileImage(oldImageKey);
        } catch (error) {
          // No lanzar error, la nueva imagen ya se subió exitosamente
        }
      }

      return newImage;
    } catch (error: any) {
      throw error;
    }
  }
}

// Instancia única del servicio
export const storageService = new StorageService();
