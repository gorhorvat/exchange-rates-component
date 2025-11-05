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

  it('handles no data available (all null results)', async () => {
    // Mock fetchExchangeRatesForDates to return all null rates
    mockedAxios.get.mockResolvedValue({
      data: { gbp: null },
    });

    const { result } = renderHook(() =>
      useExchangeRateData({
        baseCurrency: 'GBP',
        targetCurrencies: ['USD', 'EUR'],
        selectedDate: new Date('2025-11-04'),
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // When no data is available, tableData should be empty
    expect(result.current.tableData.length).toBe(0);
  });

  it('handles null rates for specific dates', async () => {
    // Mock 404 responses for some dates (which will return null from fetchExchangeRates)
    const axiosError = {
      message: 'Request failed with status code 404',
      response: {
        status: 404,
      },
    };
    
    mockedAxios.get
      .mockResolvedValueOnce({
        data: { gbp: mockRates }, // First date has rates
      })
      .mockRejectedValueOnce(axiosError) // 404 - null rates
      .mockRejectedValueOnce(axiosError) // 404 - null rates
      .mockRejectedValueOnce(axiosError) // 404 - null rates
      .mockRejectedValueOnce(axiosError) // 404 - null rates
      .mockRejectedValueOnce(axiosError) // 404 - null rates
      .mockRejectedValueOnce(axiosError) // 404 - null rates
      .mockRejectedValueOnce(axiosError); // 404 - null rates

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

    // Should have data even with some null rates
    expect(result.current.tableData.length).toBeGreaterThan(0);
  });

  it('handles missing currency in rates data', async () => {
    // Mock rates that don't include all requested currencies
    mockedAxios.get.mockResolvedValue({
      data: { 
        gbp: {
          usd: 1.25,
          // EUR is missing
        }
      },
    });

    const { result } = renderHook(() =>
      useExchangeRateData({
        baseCurrency: 'GBP',
        targetCurrencies: ['USD', 'EUR'],
        selectedDate: new Date('2025-11-04'),
      })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tableData.length).toBe(2);
    const eurRow = result.current.tableData.find(row => row.currency === 'EUR');
    
    // EUR should have 'N/A' for the date since it's not in the rates
    if (eurRow) {
      const dateKeys = Object.keys(eurRow).filter(key => key !== 'id' && key !== 'currency');
      expect(eurRow[dateKeys[0]]).toBe('N/A');
    }
  });
});
