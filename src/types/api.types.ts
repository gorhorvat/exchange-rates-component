export interface CurrencyListResponse {
    [key: string]: string;
}

export interface ExchangeRateResponse {
    [currencyCode: string]: Record<string, number>;
}

export interface ExchangeRates {
    [targetCurrency: string]: number;
}

export interface ExchangeRateRow {
    id: string;
    currency: string;
    [date: string]: string | number;
}
