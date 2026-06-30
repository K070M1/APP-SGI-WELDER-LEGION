import type { DashboardKPIs, ChartDataPoint } from '@/dtos/dashboard/dashboard.dto';

export class DashboardService {
  async getKPIs(): Promise<DashboardKPIs> {
    return new Promise(resolve => setTimeout(() => resolve({
      totalProducts: 145, lowStockProducts: 8, movementsToday: 24, activeUsers: 5
    }), 500));
  }

  async getProductsChart(): Promise<ChartDataPoint[]> {
    return new Promise(resolve => setTimeout(() => resolve([
      { label: 'Electrodos', value: 45 },
      { label: 'Máquinas', value: 30 },
      { label: 'Consumibles', value: 70 }
    ]), 600));
  }

  async getMovementsChart(): Promise<ChartDataPoint[]> {
    return new Promise(resolve => setTimeout(() => resolve([
      { label: 'Lun', value: 12 }, { label: 'Mar', value: 19 }, { label: 'Mié', value: 5 },
      { label: 'Jue', value: 25 }, { label: 'Vie', value: 15 }
    ]), 700));
  }

  async getUsersChart(): Promise<ChartDataPoint[]> {
    return new Promise(resolve => setTimeout(() => resolve([
      { label: 'Admin', value: 2 },
      { label: 'Almacén', value: 3 },
      { label: 'Operario', value: 8 }
    ]), 400));
  }
}

export const dashboardService = new DashboardService();