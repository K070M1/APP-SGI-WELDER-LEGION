import { useState, useEffect } from 'react';

export function useMovementDetail(idMovimiento: string) {
  const [movement, setMovement] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos el delay de una petición a la base de datos
    const fetchDetail = setTimeout(() => {
      setMovement({
        id_movimiento: idMovimiento,
        codigo: 'ENT-26-001',
        categoria: 'ENTRADA',
        motivo: 'COMPRA',
        entidad_relacionada: 'Ferretería Industrial S.A.C.',
        fecha_movimiento: '10 May 2026 - 14:30',
        usuario_creacion: 'Jomar García',
        monto_total: 4500.00,
        cantidad_items: 125,
        items: [
          { id_producto: 'p1', codigo: 'SOLD-6011', nombre: 'Electrodo Soldadura E6011 1/8"', cantidad: 100, precio_unitario: 15.00 },
          { id_producto: 'p2', codigo: 'MF-01', nombre: 'Máscara Fotosensible', cantidad: 25, precio_unitario: 120.00 }
        ]
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(fetchDetail);
  }, [idMovimiento]);

  return { movement, isLoading };
}