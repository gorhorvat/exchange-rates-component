export const API_CONFIG = {
  BASE_URL: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1',
  ENDPOINTS: {
    CURRENCIES: '/currencies.json',
    EXCHANGE_RATES: (date: string, baseCurrency: string) =>
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${baseCurrency.toLowerCase()}.json`,
  },
} as const;

export const HTTP_STATUS = {
  NOT_FOUND: 404,
  OK: 200,
} as const;
