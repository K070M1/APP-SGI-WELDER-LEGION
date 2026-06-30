import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/api/dashboard/dashboard.service';
import type { ChartDataPoint } from '@/dtos/dashboard/dashboard.dto';

export function useMovementsChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChart = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await dashboardService.getMovementsChart();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchChart(); }, [fetchChart]);

  return { data, isLoading, refetch: fetchChart };
}