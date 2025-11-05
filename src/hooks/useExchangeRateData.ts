import { useState, useEffect } from 'react';
import { ExchangeRateRow } from '../types/api.types';
import { getLastSevenDays } from '../utils/dateHelpers';
import { fetchExchangeRatesForDates } from '../services';
import { ERROR_MESSAGES } from '../constants';

interface UseExchangeRateDataParams {
    baseCurrency: string;
    targetCurrencies: string[];
    selectedDate: Date;
}

interface UseExchangeRateDataReturn {
    tableData: ExchangeRateRow[];
    loading: boolean;
    error: string | null;
}

/**
 * Custom hook for fetching and transforming exchange rate data
 */
const useExchangeRateData = ({
    baseCurrency,
    targetCurrencies,
    selectedDate,
}: UseExchangeRateDataParams): UseExchangeRateDataReturn => {
    const [tableData, setTableData] = useState<ExchangeRateRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchHistoricalData = async (): Promise<void> => {
            if (!baseCurrency || targetCurrencies.length === 0) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const dates = getLastSevenDays(selectedDate);
                const results = await fetchExchangeRatesForDates(baseCurrency, dates);

                // Check if all results are null (no data available)
                const hasData = results.some((result) => result.rates !== null);

                if (!isMounted) return;

                if (!hasData) {
                    setTableData([]);
                    setLoading(false);
                    return;
                }

                // Transform data: each row is a currency with rates for each date
                const rows: ExchangeRateRow[] = targetCurrencies.map((currency, index) => {
                    const row: ExchangeRateRow = {
                        id: `${currency}-${index}`,
                        currency: currency,
                    };

                    results.forEach(({ date, rates }) => {
                        if (rates) {
                            const currencyLower = currency.toLowerCase();
                            const rate = rates[currencyLower];
                            row[date] = rate !== undefined ? rate : 'N/A';
                        } else {
                            row[date] = 'N/A';
                        }
                    });

                    return row;
                });

                if (isMounted) {
                    setTableData(rows);
                }
            } catch (err) {
                if (isMounted) {
                    const errorMessage = err instanceof Error
                        ? err.message
                        : ERROR_MESSAGES.FETCH_RATES_FAILED;
                    setError(errorMessage);
                    console.error('Hook error:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchHistoricalData();

        return () => {
            isMounted = false;
        };
    }, [baseCurrency, targetCurrencies, selectedDate]);

    return { tableData, loading, error };
};

export default useExchangeRateData;
