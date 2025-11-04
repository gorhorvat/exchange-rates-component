import { renderHook, waitFor } from '@testing-library/react';
import useFetchExchangeRates from '../../hooks/useFetchExchangeRates';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useFetchExchangeRates', () => {
  it('fetches exchange rates successfully', async () => {
    const mockData = {
      gbp: {
        usd: 1.25,
        eur: 1.15,
      },
    };

    mockedAxios.get.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useFetchExchangeRates());

    await waitFor(() => {
      result.current.fetchRates('gbp', new Date('2024-01-01'));
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData.gbp);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('handles errors correctly', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFetchExchangeRates());

    await waitFor(() => {
      result.current.fetchRates('gbp', new Date('2024-01-01'));
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.loading).toBe(false);
    });
  });
});
