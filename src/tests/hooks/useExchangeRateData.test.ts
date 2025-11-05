import { renderHook, waitFor } from '@testing-library/react';
import useExchangeRateData from '../../hooks/useExchangeRateData';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useExchangeRateData', () => {
  const mockRates = {
    usd: 1.25,
    eur: 1.1,
    jpy: 130.5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: { gbp: mockRates },
    });
  });

  it('fetches exchange rate data', async () => {
    const { result } = renderHook(() =>
      useExchangeRateData({
        baseCurrency: 'GBP',
        targetCurrencies: ['USD', 'EUR', 'JPY'],
        selectedDate: new Date('2025-11-04'),
      })
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tableData.length).toBe(3);
  });

  it('returns data in correct format', async () => {
    const { result } = renderHook(() =>
      useExchangeRateData({
        baseCurrency: 'GBP',
        targetCurrencies: ['USD'],
        selectedDate: new Date('2025-11-04'),
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const row = result.current.tableData[0];
    expect(row).toHaveProperty('id');
    expect(row).toHaveProperty('currency');
    expect(row.currency).toBe('USD');
  });

  it('handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() =>
      useExchangeRateData({
        baseCurrency: 'GBP',
        targetCurrencies: ['USD'],
        selectedDate: new Date('2025-11-04'),
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.tableData.length).toBe(0);
  });

  it('skips fetch when required params are missing', () => {
    const { result } = renderHook(() =>
      useExchangeRateData({
        baseCurrency: '',
        targetCurrencies: [],
        selectedDate: new Date('2025-11-04'),
      })
    );

    expect(result.current.tableData.length).toBe(0);
  });
});
