import axios, { AxiosError } from 'axios';
import { fetchAvailableCurrencies, fetchExchangeRates, fetchExchangeRatesForDates } from '../../services/currencyService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('currencyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAvailableCurrencies', () => {
    it('fetches and returns available currencies', async () => {
      const mockCurrencies = {
        usd: 'US Dollar',
        eur: 'Euro',
        gbp: 'British Pound',
      };

      mockedAxios.get.mockResolvedValue({
        data: mockCurrencies,
      });

      const result = await fetchAvailableCurrencies();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('currencies.json')
      );
      expect(result).toEqual(mockCurrencies);
    });

    it('throws error when API fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(fetchAvailableCurrencies()).rejects.toThrow('Network error');
    });
  });

  describe('fetchExchangeRates', () => {
    const mockRates = {
      usd: 1.25,
      eur: 1.1,
      jpy: 130.5,
    };

    it('fetches exchange rates for a given date and currency', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { gbp: mockRates },
      });

      const result = await fetchExchangeRates('GBP', new Date('2025-11-04'));

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('2025-11-04')
      );
      expect(result).toEqual(mockRates);
    });

    it('returns null for 404 errors (data not available)', async () => {
      const axiosError = {
        message: 'Request failed with status code 404',
        response: {
          status: 404,
        },
      } as AxiosError;

      mockedAxios.get.mockRejectedValue(axiosError);

      const result = await fetchExchangeRates('GBP', new Date('2025-11-04'));

      // Should return null for 404
      expect(result).toBeNull();
    });

    it('throws error for non-404 errors', async () => {
      const axiosError = {
        message: 'Network error',
        response: {
          status: 500,
        },
      } as AxiosError;

      mockedAxios.get.mockRejectedValue(axiosError);

      await expect(fetchExchangeRates('GBP', new Date('2025-11-04'))).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('fetchExchangeRatesForDates', () => {
    const mockRates = {
      usd: 1.25,
      eur: 1.1,
    };

    it('fetches exchange rates for multiple dates', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { gbp: mockRates },
      });

      const dates = [new Date('2025-11-04'), new Date('2025-11-03')];
      const result = await fetchExchangeRatesForDates('GBP', dates);

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2025-11-04');
      expect(result[0].rates).toEqual(mockRates);
    });

    it('handles mixed success and 404 responses', async () => {
      const axiosError = {
        message: 'Request failed with status code 404',
        response: {
          status: 404,
        },
      } as AxiosError;

      mockedAxios.get
        .mockResolvedValueOnce({
          data: { gbp: mockRates },
        })
        .mockRejectedValueOnce(axiosError);

      const dates = [new Date('2025-11-04'), new Date('2025-11-03')];
      const result = await fetchExchangeRatesForDates('GBP', dates);

      expect(result).toHaveLength(2);
      expect(result[0].rates).toEqual(mockRates);
      expect(result[1].rates).toBeNull();
    });

    it('returns empty array for empty dates', async () => {
      const result = await fetchExchangeRatesForDates('GBP', []);

      expect(result).toHaveLength(0);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });
  });
});
