export interface UserListItem {
  id: string;
  id_usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'ADMIN' | 'ALMACENERO' | 'OPERARIO';
  id_estado: number;
  estado: string;
  fecha_creacion: string;
}