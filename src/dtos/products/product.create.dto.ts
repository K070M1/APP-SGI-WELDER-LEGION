export type ProductCreateDto = {
  nombre: string;
  codigo: string;
  precio: number;
  stock_min: number;
  descripcion?: string | null;
  id_marca: string;
  id_subcategoria: string;
  id_moneda: string;
  id_estado: number;
};