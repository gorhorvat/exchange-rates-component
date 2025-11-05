import { useState, useEffect } from 'react';
import { CurrencyListResponse } from '../types/api.types';
import { fetchAvailableCurrencies } from '../services';
import { ERROR_MESSAGES } from '../constants';

interface UseCurrenciesReturn {
  currencies: CurrencyListResponse;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and manage available currencies
 * @returns Object containing currencies data, loading state, and error
 */
export const useCurrencies = (): UseCurrenciesReturn => {
  const [currencies, setCurrencies] = useState<CurrencyListResponse>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCurrencies = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAvailableCurrencies();

        if (isMounted) {
          setCurrencies(data);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.FETCH_CURRENCIES_FAILED;
          setError(errorMessage);
          console.error('Error fetching currencies:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCurrencies();

    return () => {
      isMounted = false;
    };
  }, []);

  return { currencies, loading, error };
};
