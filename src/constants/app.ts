export const APP_CONFIG = {
  CURRENCY: {
    MIN_SELECTION: 3,
    MAX_SELECTION: 7,
    DEFAULT_BASE: 'GBP',
    DEFAULT_TARGETS: ['USD', 'EUR', 'JPY', 'CHF', 'CAD', 'AUD', 'ZAR'],
  },
  DATE: {
    MAX_PAST_DAYS: 90,
    HISTORY_DAYS: 7,
    LOCALE: 'en-GB',
  },
  TABLE: {
    HEIGHT: 425,
    COLUMN_WIDTH: 130
  },
} as const;

export const ERROR_MESSAGES = {
  FETCH_CURRENCIES_FAILED: 'Failed to fetch available currencies',
  FETCH_RATES_FAILED: 'Failed to fetch exchange rates',
  NO_DATA_AVAILABLE: 'No data available for the selected criteria',
} as const;
