export interface DashboardKPIs {
  totalProducts: number;
  lowStockProducts: number;
  movementsToday: number;
  activeUsers: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}