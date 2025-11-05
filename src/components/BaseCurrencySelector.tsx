import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { useCurrencies } from '../hooks/useCurrencies';

interface BaseCurrencySelectorProps {
    selectedCurrency: string;
    onCurrencyChange: (currency: string) => void;
}

const BaseCurrencySelector: React.FC<BaseCurrencySelectorProps> = ({
    selectedCurrency,
    onCurrencyChange,
}) => {
    const { currencies, loading, error } = useCurrencies();

    const handleChange = (event: SelectChangeEvent<string>): void => {
        onCurrencyChange(event.target.value.toUpperCase());
    };

    if (error) {
        console.error('Failed to load currencies:', error);
    }

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
                {Object.keys(currencies).map((code) => (
                    <MenuItem key={code} value={code.toUpperCase()}>
                        {code.toUpperCase()} - {currencies[code]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default BaseCurrencySelector;
