import { insforge } from '@/lib/insforge';
import type { DashboardKPIs, ChartDataPoint } from '@/dtos/dashboard/dashboard.dto';

export class DashboardService {
  async getKPIs(): Promise<DashboardKPIs> {
    try {
      const { count: totalProductsCount } = await insforge.database
        .from('producto')
        .select('*', { count: 'exact', head: true });

      const { data: products } = await insforge.database
        .from('producto')
        .select('stock, stockMin');
      
      const lowStockProducts = products ? products.filter((p: any) => p.stock <= p.stockMin).length : 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: movementsTodayCount } = await insforge.database
        .from('movimiento')
        .select('*', { count: 'exact', head: true })
        .gte('fechaRegistro', today.toISOString());

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: recentMovements } = await insforge.database
        .from('movimiento')
        .select('id_usuario')
        .gte('fechaRegistro', weekAgo.toISOString());
        
      const activeUsersSet = new Set(recentMovements?.map((m: any) => m.id_usuario) || []);
      
      return {
        totalProducts: totalProductsCount || 0,
        lowStockProducts,
        movementsToday: movementsTodayCount || 0,
        activeUsers: activeUsersSet.size
      };
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      return { totalProducts: 0, lowStockProducts: 0, movementsToday: 0, activeUsers: 0 };
    }
  }

  async getProductsChart(): Promise<ChartDataPoint[]> {
    try {
      const { data, error } = await insforge.database
        .from('producto')
        .select('nombre, stock')
        .order('stock', { ascending: false })
        .limit(5);

      if (error) throw error;

      return (data || []).map((p: any) => ({
        label: p.nombre.length > 10 ? p.nombre.substring(0, 10) + '...' : p.nombre,
        value: p.stock || 0
      }));
    } catch (error) {
      console.error('Error in getProductsChart:', error);
      return [];
    }
  }

  async getMovementsChart(): Promise<ChartDataPoint[]> {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data, error } = await insforge.database
        .from('movimiento')
        .select('tipo')
        .gte('fechaRegistro', weekAgo.toISOString());

      if (error) throw error;

      let entradas = 0;
      let salidas = 0;

      (data || []).forEach((m: any) => {
        if (m.tipo === 'ENTRADA') entradas++;
        if (m.tipo === 'SALIDA') salidas++;
      });

      return [
        { label: 'Entradas', value: entradas },
        { label: 'Salidas', value: salidas }
      ];
    } catch (error) {
      console.error('Error in getMovementsChart:', error);
      return [];
    }
  }

  async getUsersChart(): Promise<ChartDataPoint[]> {
    try {
      const { data, error } = await insforge.database
        .from('usuario')
        .select('rol');

      if (error) throw error;

      const roleCounts: Record<string, number> = {};
      
      (data || []).forEach((u: any) => {
        const rol = u.rol || 'Sin Rol';
        // Capitalize role for better presentation
        const formattedRol = rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase();
        roleCounts[formattedRol] = (roleCounts[formattedRol] || 0) + 1;
      });

      return Object.entries(roleCounts)
        .map(([label, value]) => ({ label, value }));
    } catch (error) {
      console.error('Error in getUsersChart:', error);
      return [];
    }
  }

  async getActiveUsersChart(): Promise<ChartDataPoint[]> {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data, error } = await insforge.database
        .from('movimiento')
        .select(`
          id_usuario,
          usuario ( nombreUsuario )
        `)
        .gte('fechaRegistro', weekAgo.toISOString());

      if (error) throw error;

      const userCounts: Record<string, number> = {};
      
      (data || []).forEach((m: any) => {
        const userObj = Array.isArray(m.usuario) ? m.usuario[0] : m.usuario;
        const name = userObj?.nombreUsuario || 'Desconocido';
        const shortName = name.split(' ')[0];
        userCounts[shortName] = (userCounts[shortName] || 0) + 1;
      });

      const sortedUsers = Object.entries(userCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, value]) => ({ label, value }));

      return sortedUsers;
    } catch (error) {
      console.error('Error in getActiveUsersChart:', error);
      return [];
    }
  }
}

export const dashboardService = new DashboardService();