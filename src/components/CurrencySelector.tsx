import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import { CurrencySelectorProps } from '../types/currency.types';
import { CurrencyListResponse } from '../types/api.types';

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
    selectedCurrencies,
    onCurrenciesChange,
    baseCurrency,
    minCurrencies = 3,
    maxCurrencies = 7,
}) => {
    const [availableCurrencies, setAvailableCurrencies] = useState<CurrencyListResponse>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCurrencies = async (): Promise<void> => {
            try {
                const response = await axios.get<CurrencyListResponse>(
                    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
                );
                setAvailableCurrencies(response.data);
            } catch (error) {
                console.error('Error fetching currencies:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCurrencies();
    }, []);

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
                        Object.keys(availableCurrencies)
                            .filter((code) => code.toUpperCase() !== baseCurrency.toUpperCase())
                            .map((code) => (
                                <MenuItem key={code} value={code.toUpperCase()}>
                                    {code.toUpperCase()} - {availableCurrencies[code]}
                                </MenuItem>
                            ))
                    )}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CurrencySelector;
