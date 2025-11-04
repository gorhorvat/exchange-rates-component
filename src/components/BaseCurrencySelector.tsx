import React, { useEffect, useState } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';
import { CurrencyListResponse } from '../types/api.types';

interface BaseCurrencySelectorProps {
    selectedCurrency: string;
    onCurrencyChange: (currency: string) => void;
}

const BaseCurrencySelector: React.FC<BaseCurrencySelectorProps> = ({
    selectedCurrency,
    onCurrencyChange,
}) => {
    const [availableCurrencies, setAvailableCurrencies] = useState<CurrencyListResponse>({});
    const [loading, setLoading] = useState(true);

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

    const handleChange = (event: SelectChangeEvent<string>): void => {
        onCurrencyChange(event.target.value.toUpperCase());
    };

    return (
        <FormControl fullWidth disabled={loading}>
            <InputLabel id="base-currency-label">Base Currency</InputLabel>
            <Select
                labelId="base-currency-label"
                id="base-currency-select"
                value={loading ? '' : selectedCurrency}
                onChange={handleChange}
                label="Base Currency"
            >
                {Object.keys(availableCurrencies).map((code) => (
                    <MenuItem key={code} value={code.toUpperCase()}>
                        {code.toUpperCase()} - {availableCurrencies[code]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default BaseCurrencySelector;
