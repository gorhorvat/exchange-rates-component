import { useState, useCallback } from 'react';
import { ExchangeRates } from '../types/api.types';
import { fetchExchangeRates } from '../services';
import { ERROR_MESSAGES } from '../constants';

interface UseFetchExchangeRatesReturn {
    data: ExchangeRates | null;
    loading: boolean;
    error: string | null;
    fetchRates: (baseCurrency: string, date: Date) => Promise<void>;
}

/**
 * Custom hook for fetching exchange rates on demand
 */
const useFetchExchangeRates = (): UseFetchExchangeRatesReturn => {
    const [data, setData] = useState<ExchangeRates | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRates = useCallback(async (baseCurrency: string, date: Date): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const rates = await fetchExchangeRates(baseCurrency, date);
            setData(rates);
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : ERROR_MESSAGES.FETCH_RATES_FAILED;
            setError(errorMessage);
            console.error('Error fetching rates:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchRates };
};

export default useFetchExchangeRates;
