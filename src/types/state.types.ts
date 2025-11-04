import { CurrencyListResponse, ExchangeRates } from "./api.types";

export interface CurrencyState {
    availableCurrencies: CurrencyListResponse;
    baseCurrency: string;
    error: string | null;
    exchangeRates: { [date: string]: ExchangeRates };
    loading: boolean;
    selectedCurrencies: string[];
    selectedDate: Date;
}

export interface RootState {
    currency: CurrencyState;
}
