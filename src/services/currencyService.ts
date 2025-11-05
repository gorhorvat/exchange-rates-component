import axios, { AxiosError } from 'axios';
import { API_CONFIG, HTTP_STATUS } from '../constants';
import { CurrencyListResponse, ExchangeRates, ExchangeRateResponse } from '../types/api.types';

/**
 * Fetches the list of available currencies
 * @returns Promise with currency list
 * @throws Error if the request fails
 */
export const fetchAvailableCurrencies = async (): Promise<CurrencyListResponse> => {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CURRENCIES}`;
    const response = await axios.get<CurrencyListResponse>(url);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw new Error(axiosError.message || 'Failed to fetch currencies');
  }
};

/**
 * Fetches exchange rates for a specific base currency and date
 * @param baseCurrency - The base currency code
 * @param date - The date for which to fetch rates
 * @returns Promise with exchange rates or null if data not found (404)
 * @throws Error if the request fails (non-404 errors)
 */
export const fetchExchangeRates = async (
  baseCurrency: string,
  date: Date
): Promise<ExchangeRates | null> => {
  try {
    const formattedDate = date.toISOString().split('T')[0];
    const url = API_CONFIG.ENDPOINTS.EXCHANGE_RATES(formattedDate, baseCurrency);

    const response = await axios.get<ExchangeRateResponse>(url);
    const rates = response.data[baseCurrency.toLowerCase()] as ExchangeRates;
    return rates;
  } catch (error) {
    const axiosError = error as AxiosError;

    // Return null for 404 (data not available for that date)
    if (axiosError.response?.status === HTTP_STATUS.NOT_FOUND) {
      return null;
    }

    throw new Error(axiosError.message || 'Failed to fetch exchange rates');
  }
};

/**
 * Fetches exchange rates for multiple dates
 * @param baseCurrency - The base currency code
 * @param dates - Array of dates to fetch rates for
 * @returns Promise with array of results (date and rates, or null if not found)
 */
export const fetchExchangeRatesForDates = async (
  baseCurrency: string,
  dates: Date[]
): Promise<Array<{ date: string; rates: ExchangeRates | null }>> => {
  const promises = dates.map(async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const rates = await fetchExchangeRates(baseCurrency, date);
    return { date: formattedDate, rates };
  });

  return Promise.all(promises);
};
