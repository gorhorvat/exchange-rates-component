import React from 'react';
import { Box, Alert, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    setBaseCurrency,
    setSelectedCurrencies,
    setSelectedDate,
} from '../store/slices/currencySlice';
import BaseCurrencySelector from './BaseCurrencySelector';
import CurrencySelector from './CurrencySelector';
import DatePicker from './DatePicker';
import CurrencyTable from './CurrencyTable';
import useExchangeRateData from '../hooks/useExchangeRateData';

const CurrencyExchangeRates: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
        baseCurrency,
        selectedCurrencies,
        selectedDate,
        error: storeError,
    } = useAppSelector((state) => state.currency);

    const { tableData, loading, error: hookError } = useExchangeRateData({
        baseCurrency,
        targetCurrencies: selectedCurrencies,
        selectedDate,
    });

    const error = storeError || hookError;

    const handleBaseCurrencyChange = (currency: string): void => {
        dispatch(setBaseCurrency(currency));
    };

    const handleCurrenciesChange = (currencies: string[]): void => {
        dispatch(setSelectedCurrencies(currencies));
    };

    const handleDateChange = (date: Date): void => {
        dispatch(setSelectedDate(date));
    };

    return (
        <Box sx={{ width: '100%' }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid component="div" size={{ xs: 12, sm: 6, md: 4 }}>
                    <BaseCurrencySelector
                        selectedCurrency={baseCurrency}
                        onCurrencyChange={handleBaseCurrencyChange}
                    />
                </Grid>

                <Grid component="div" size={{ xs: 12, sm: 6, md: 4 }}>
                    <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
                </Grid>

                <Grid component="div" size={{ xs: 12, md: 4 }}>
                    <CurrencySelector
                        selectedCurrencies={selectedCurrencies}
                        onCurrenciesChange={handleCurrenciesChange}
                        baseCurrency={baseCurrency}
                        minCurrencies={3}
                        maxCurrencies={7}
                    />
                </Grid>
            </Grid>

            <CurrencyTable
                data={tableData}
                loading={loading}
                error={error}
                selectedCurrencies={selectedCurrencies}
            />
        </Box>
    );
};

export default CurrencyExchangeRates;
