import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { ExchangeRateResponse, ExchangeRates } from '../types/api.types';

interface UseFetchExchangeRatesReturn {
    data: ExchangeRates | null;
    loading: boolean;
    error: string | null;
    fetchRates: (baseCurrency: string, date: Date) => Promise<void>;
}

const useFetchExchangeRates = (): UseFetchExchangeRatesReturn => {
    const [data, setData] = useState<ExchangeRates | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRates = useCallback(async (baseCurrency: string, date: Date): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const formattedDate = date.toISOString().split('T')[0];
            const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${formattedDate}/v1/currencies/${baseCurrency.toLowerCase()}.json`;

            const response = await axios.get<ExchangeRateResponse>(url);
            const rates = response.data[baseCurrency.toLowerCase()] as ExchangeRates;
            setData(rates);
        } catch (err) {
            const axiosError = err as AxiosError;
            setError(axiosError.message || 'Failed to fetch exchange rates');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchRates };
};

export default useFetchExchangeRates;
