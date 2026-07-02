import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Camera, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { Text } from '@/shared/components/ui/text';
import { Icon } from '@/shared/components/ui/icon';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useAuth } from '@/shared/hooks/use-auth';
import { userService } from '@/api/user/user.service';
import { storageService } from '@/api/storage/storage.service';

export function EditProfileScreen() {
    const navigation = useNavigation();
    const { user, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        nombre_usuario: user?.nombreUsuario || '',
        perfil: user?.perfil || '',
        clave: '',
        confirmar_clave: '',
    });

    const [imageUri, setImageUri] = useState<string | null>(user?.perfil || null);
    const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');

    const handleSelectImage = async () => {
        try {
            // Solicitar permisos
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu galería para seleccionar una imagen');
                return;
            }

            // Abrir selector de imágenes
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const selectedImage = result.assets[0];
                setImageUri(selectedImage.uri);
                setImageMimeType(selectedImage.mimeType || 'image/jpeg');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    const handleTakePhoto = async () => {
        try {
            // Solicitar permisos de cámara
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permisos requeridos', 'Necesitamos acceso a tu cámara para tomar una foto');
                return;
            }

            // Abrir cámara
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const photo = result.assets[0];
                setImageUri(photo.uri);
                setImageMimeType(photo.mimeType || 'image/jpeg');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo tomar la foto');
        }
    };

    const handleImageSelection = () => {
        Alert.alert(
            'Imagen de Perfil',
            'Elige una opción',
            [
                {
                    text: 'Galería',
                    onPress: handleSelectImage,
                },
                {
                    text: 'Cámara',
                    onPress: handleTakePhoto,
                },
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
            ]
        );
    };

    const handleSubmit = async () => {
        try {
            // Validaciones
            if (!formData.nombre_usuario.trim()) {
                Alert.alert('Error', 'El nombre de usuario es requerido');
                return;
            }

            // Si hay contraseñas, validar
            if (formData.clave || formData.confirmar_clave) {
                if (formData.clave !== formData.confirmar_clave) {
                    Alert.alert('Error', 'Las contraseñas no coinciden');
                    return;
                }

                if (formData.clave.length < 6) {
                    Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
                    return;
                }
            }

            setIsLoading(true);

            let profileImageUrl = formData.perfil;

            // Si hay una imagen nueva seleccionada, subirla
            if (imageUri && imageUri !== formData.perfil) {
                try {
                    setIsUploadingImage(true);

                    // Obtener el tamaño del archivo
                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    const fileSize = blob.size;

                    // Extraer extensión del tipo MIME
                    const extension = imageMimeType.split('/')[1] || 'jpg';
                    const fileName = `${user!.id}-${Date.now()}.${extension}`;

                    // En React Native, crear un objeto File-like compatible con todos los campos requeridos
                    const file = {
                        uri: imageUri,
                        type: imageMimeType,
                        name: fileName,
                        size: fileSize,
                    } as any;

                    // Subir a InsForge Storage
                    const { url } = await storageService.replaceProfileImage(
                        user!.id,
                        file,
                        formData.perfil || undefined
                    );

                    profileImageUrl = url;
                } catch (uploadError: any) {
                    Alert.alert('Error', 'No se pudo subir la imagen de perfil: ' + (uploadError.message || ''));
                    setIsUploadingImage(false);
                    setIsLoading(false);
                    return;
                } finally {
                    setIsUploadingImage(false);
                }
            }

            // Actualizar perfil
            const updateData: any = {
                nombre_usuario: formData.nombre_usuario,
                perfil: profileImageUrl,
            };

            // Solo agregar contraseña si se proporcionó
            if (formData.clave && formData.clave.trim()) {
                updateData.clave = formData.clave;
            }

            const result = await userService.updateProfile(user!.id, updateData);

            // Actualizar el store local
            if (result.data) {
                updateUser({
                    nombreUsuario: result.data.nombre_usuario,
                    perfil: result.data.perfil,
                });
            }

            Alert.alert(
                'Éxito',
                'Perfil actualizado correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]">
            {/* CABECERA */}
            <View className="flex-row items-center px-4 pt-4 pb-4 bg-white border-b border-[#E8E8E8]">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
                    <Icon as={ChevronLeft} size={24} className="text-[#333333]" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-[#333333]">Editar Perfil</Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
                {/* IMAGEN DE PERFIL */}
                <View className="items-center mb-6">
                    <TouchableOpacity onPress={handleImageSelection} disabled={isUploadingImage}>
                        <View className="relative">
                            <Avatar alt="avatar" className="size-32 rounded-full bg-[#748FFC]/10 border-2 border-[#748FFC]/20">
                                {imageUri ? (
                                    <AvatarImage source={{ uri: imageUri }} />
                                ) : (
                                    <AvatarFallback>
                                        <Icon as={User} size={50} className="text-[#748FFC]" />
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            {/* Badge de cámara */}
                            <View className="absolute bottom-0 right-0 size-10 rounded-full bg-[#748FFC] border-4 border-white items-center justify-center">
                                {isUploadingImage ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Icon as={Camera} size={18} className="text-white" />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Text className="text-sm text-[#999999] mt-3 text-center">
                        Toca para cambiar la foto de perfil
                    </Text>
                </View>

                {/* FORMULARIO */}
                <View className="gap-4">
                    {/* Nombre de Usuario */}
                    <View>
                        <Label nativeID="nombre_usuario" className="mb-2">
                            Nombre de Usuario
                        </Label>
                        <Input
                            placeholder="Ingresa tu nombre de usuario"
                            value={formData.nombre_usuario}
                            onChangeText={(text) => setFormData({ ...formData, nombre_usuario: text })}
                            aria-labelledby="nombre_usuario"
                            className="h-12"
                        />
                    </View>

                    {/* Nueva Contraseña */}
                    <View>
                        <Label nativeID="clave" className="mb-2">
                            Nueva Contraseña (opcional)
                        </Label>
                        <Input
                            placeholder="Mínimo 6 caracteres"
                            value={formData.clave}
                            onChangeText={(text) => setFormData({ ...formData, clave: text })}
                            secureTextEntry
                            aria-labelledby="clave"
                            className="h-12"
                        />
                    </View>

                    {/* Confirmar Contraseña */}
                    <View>
                        <Label nativeID="confirmar_clave" className="mb-2">
                            Confirmar Contraseña
                        </Label>
                        <Input
                            placeholder="Confirma tu contraseña"
                            value={formData.confirmar_clave}
                            onChangeText={(text) => setFormData({ ...formData, confirmar_clave: text })}
                            secureTextEntry
                            aria-labelledby="confirmar_clave"
                            className="h-12"
                        />
                    </View>
                </View>

                {/* BOTONES */}
                <View className="flex-row gap-3 mt-8 mb-6">
                    <Button
                        variant="outline"
                        onPress={() => navigation.goBack()}
                        className="flex-1 h-12"
                        disabled={isLoading}
                    >
                        <Text>Cancelar</Text>
                    </Button>

                    <Button
                        onPress={handleSubmit}
                        className="flex-1 h-12 bg-[#748FFC]"
                        disabled={isLoading || isUploadingImage}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text className="text-white font-semibold">Guardar Cambios</Text>
                        )}
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
