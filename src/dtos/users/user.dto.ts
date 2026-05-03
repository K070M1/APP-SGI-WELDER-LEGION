import type { AuditedEntity } from "@/dtos/core/audit.dto";

export type UserListItem = AuditedEntity & {
  id: string;
  id_usuario: string;
  nombre_usuario: string;
  correo: string;
  id_rol: string;
  nombre_rol: string;
  id_estado: number;
  estado: string;
};

export type UserDetail = UserListItem & {
  ultimo_acceso?: string | null;
};