import { useState, useEffect } from 'react';
import { DashboardService, MarketOverview, ProductComparison, ProspectRanking } from '../services/dashboardService';

export function useMarketOverview() {
  const [data, setData] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const overview = await DashboardService.getMarketOverview();
        setData(overview);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error, refetch: () => fetchData() };
}

export function useProductComparison() {
  const [data, setData] = useState<ProductComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const comparison = await DashboardService.getProductComparison();
        setData(comparison);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar comparación');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error, refetch: () => fetchData() };
}

export function useProspectRanking() {
  const [data, setData] = useState<ProspectRanking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const ranking = await DashboardService.getProspectRanking();
        setData(ranking);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar prospectos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error, refetch: () => fetchData() };
}
