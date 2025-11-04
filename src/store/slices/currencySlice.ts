import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CurrencyState } from '../../types/state.types';
import { ExchangeRates, ExchangeRateResponse } from '../../types/api.types';

const initialState: CurrencyState = {
    baseCurrency: 'GBP',
    selectedCurrencies: ['USD', 'EUR', 'JPY', 'CHF', 'CAD', 'AUD', 'ZAR'],
    selectedDate: new Date(),
    exchangeRates: {},
    availableCurrencies: {},
    loading: false,
    error: null,
};

// Async thunk for fetching exchange rates
export const fetchExchangeRates = createAsyncThunk<
    { date: string; rates: ExchangeRates },
    { baseCurrency: string; date: Date },
    { rejectValue: string }
>(
    'currency/fetchExchangeRates',
    async ({ baseCurrency, date }, { rejectWithValue }) => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${formattedDate}/v1/currencies/${baseCurrency.toLowerCase()}.json`;

            const response = await axios.get<ExchangeRateResponse>(url);
            const rates = response.data[baseCurrency.toLowerCase()] as ExchangeRates;

            return { date: formattedDate, rates };
        } catch (error) {
            return rejectWithValue('Failed to fetch exchange rates');
        }
    }
);

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setBaseCurrency: (state, action: PayloadAction<string>) => {
            state.baseCurrency = action.payload;
        },
        setSelectedCurrencies: (state, action: PayloadAction<string[]>) => {
            state.selectedCurrencies = action.payload;
        },
        setSelectedDate: (state, action: PayloadAction<Date>) => {
            state.selectedDate = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExchangeRates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExchangeRates.fulfilled, (state, action) => {
                state.loading = false;
                state.exchangeRates[action.payload.date] = action.payload.rates;
            })
            .addCase(fetchExchangeRates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Unknown error occurred';
            });
    },
});

export const { setBaseCurrency, setSelectedCurrencies, setSelectedDate } = currencySlice.actions;
export default currencySlice.reducer;
