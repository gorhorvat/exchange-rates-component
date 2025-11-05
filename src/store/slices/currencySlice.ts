import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CurrencyState } from '../../types/state.types';
import { ExchangeRates } from '../../types/api.types';
import { fetchExchangeRates as fetchRatesService } from '../../services';
import { APP_CONFIG, ERROR_MESSAGES } from '../../constants';

const initialState: CurrencyState = {
    baseCurrency: APP_CONFIG.CURRENCY.DEFAULT_BASE,
    selectedCurrencies: [...APP_CONFIG.CURRENCY.DEFAULT_TARGETS],
    selectedDate: new Date(),
    exchangeRates: {},
    availableCurrencies: {},
    loading: false,
    error: null,
};

/**
 * Async thunk for fetching exchange rates
 * Uses centralized service for data fetching
 */
export const fetchExchangeRates = createAsyncThunk<
    { date: string; rates: ExchangeRates | null },
    { baseCurrency: string; date: Date },
    { rejectValue: string }
>(
    'currency/fetchExchangeRates',
    async ({ baseCurrency, date }, { rejectWithValue }) => {
        try {
            const rates = await fetchRatesService(baseCurrency, date);
            const formattedDate = date.toISOString().split('T')[0];
            return { date: formattedDate, rates };
        } catch (error) {
            return rejectWithValue(ERROR_MESSAGES.FETCH_RATES_FAILED);
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
                if (action.payload.rates) {
                    state.exchangeRates[action.payload.date] = action.payload.rates;
                }
            })
            .addCase(fetchExchangeRates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Unknown error occurred';
            });
    },
});

export const { setBaseCurrency, setSelectedCurrencies, setSelectedDate } = currencySlice.actions;
export default currencySlice.reducer;
