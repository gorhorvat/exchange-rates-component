import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExchangeRateRow, ExchangeRates } from '../types/api.types';
import { getLastSevenDays } from '../utils/dateHelpers';

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

const useExchangeRateData = ({
    baseCurrency,
    targetCurrencies,
    selectedDate,
}: UseExchangeRateDataParams): UseExchangeRateDataReturn => {
    const [tableData, setTableData] = useState<ExchangeRateRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHistoricalData = async (): Promise<void> => {
            setLoading(true);
            setError(null);

            try {
                const dates = getLastSevenDays(selectedDate);

                // Fetch rates for all dates
                const promises = dates.map(async (date) => {
                    const formattedDate = date.toISOString().split('T')[0];
                    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${formattedDate}/v1/currencies/${baseCurrency.toLowerCase()}.json`;

                    const response = await axios.get(url);
                    const allRates = response.data[baseCurrency.toLowerCase()] as ExchangeRates;

                    return { date: formattedDate, rates: allRates };
                });

                const results = await Promise.all(promises);

                // Reorganize data: each row is a currency with rates for each date
                const rows: ExchangeRateRow[] = targetCurrencies.map((currency, index) => {
                    const row: ExchangeRateRow = {
                        id: `${currency}-${index}`,
                        currency: currency,
                    };

                    results.forEach(({ date, rates }) => {
                        const currencyLower = currency.toLowerCase();
                        const rate = rates[currencyLower];

                        row[date] = rate !== undefined ? rate : 'N/A';
                    });

                    return row;
                });

                setTableData(rows);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exchange rates';
                setError(errorMessage);
                console.error('Hook error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (baseCurrency && targetCurrencies.length > 0) {
            fetchHistoricalData();
        }
    }, [baseCurrency, targetCurrencies, selectedDate]);

    return { tableData, loading, error };
};

export default useExchangeRateData;
