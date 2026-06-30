import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/api/dashboard/dashboard.service';
import type { DashboardKPIs } from '@/dtos/dashboard/dashboard.dto';

export function useDashboardKPIs() {
  const [data, setData] = useState<DashboardKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKPIs = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await dashboardService.getKPIs();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchKPIs(); }, [fetchKPIs]);

  return { data, isLoading, refetch: fetchKPIs };
}