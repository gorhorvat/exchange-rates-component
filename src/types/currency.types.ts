import { ExchangeRateRow } from "./api.types";

export interface CurrencySelectorProps {
    baseCurrency: string;
    maxCurrencies?: number;
    minCurrencies?: number;
    selectedCurrencies: string[];
    onCurrenciesChange: (currencies: string[]) => void;
}

export interface CurrencyTableProps {
    data: ExchangeRateRow[];
    error: string | null;
    loading: boolean;
    selectedCurrencies: string[];
}

export interface DatePickerProps {
    maxPastDays?: number;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}
