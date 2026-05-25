export interface UserListItem {
  id: string;
  nombre_usuario: string;
  correo: string;
  rol: string;
  estado: number;
  uuid?: string;
  perfil?: string;
}