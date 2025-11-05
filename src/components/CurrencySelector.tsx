import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Box,
    SelectChangeEvent,
    CircularProgress,
} from '@mui/material';
import { CurrencySelectorProps } from '../types/currency.types';
import { useCurrencies } from '../hooks/useCurrencies';
import { APP_CONFIG } from '../constants';

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
    selectedCurrencies,
    onCurrenciesChange,
    baseCurrency,
    minCurrencies = APP_CONFIG.CURRENCY.MIN_SELECTION,
    maxCurrencies = APP_CONFIG.CURRENCY.MAX_SELECTION,
}) => {
    const { currencies, loading, error } = useCurrencies();

    const handleChange = (event: SelectChangeEvent<string[]>): void => {
        const value = event.target.value;
        const newCurrencies = typeof value === 'string' ? value.split(',') : value;

        if (newCurrencies.length >= minCurrencies && newCurrencies.length <= maxCurrencies) {
            onCurrenciesChange(newCurrencies);
        }
    };

    const handleDelete = (currencyToDelete: string): void => {
        if (selectedCurrencies.length > minCurrencies) {
            onCurrenciesChange(selectedCurrencies.filter((c) => c !== currencyToDelete));
        }
    };

    if (error) {
        console.error('Failed to load currencies:', error);
    }

    return (
        <Box sx={{ minWidth: 300, marginBottom: 2 }}>
            <FormControl fullWidth disabled={loading}>
                <InputLabel>Target Currencies</InputLabel>
                <Select
                    multiple
                    value={selectedCurrencies}
                    onChange={handleChange}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                selected.map((value) => (
                                    <Chip
                                        key={value}
                                        label={value}
                                        onDelete={() => handleDelete(value)}
                                        onMouseDown={(e) => e.stopPropagation()}
                                    />
                                ))
                            )}
                        </Box>
                    )}
                >
                    {loading ? (
                        <MenuItem disabled>Loading currencies...</MenuItem>
                    ) : (
                        Object.keys(currencies)
                            .filter((code) => code.toUpperCase() !== baseCurrency.toUpperCase())
                            .map((code) => (
                                <MenuItem key={code} value={code.toUpperCase()}>
                                    {code.toUpperCase()} - {currencies[code]}
                                </MenuItem>
                            ))
                    )}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CurrencySelector;
