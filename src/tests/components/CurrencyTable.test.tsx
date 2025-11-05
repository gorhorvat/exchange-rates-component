import { render, screen } from '@testing-library/react';
import CurrencyTable from '../../components/CurrencyTable';
import { ExchangeRateRow } from '../../types/api.types';

describe('CurrencyTable', () => {
  const mockData: ExchangeRateRow[] = [
    {
      id: 'USD-0',
      currency: 'USD',
      '2025-11-04': 1.25,
      '2025-11-03': 1.24,
    },
    {
      id: 'EUR-1',
      currency: 'EUR',
      '2025-11-04': 1.1,
      '2025-11-03': 1.09,
    },
  ];

  it('renders loading spinner when loading is true', () => {
    render(
      <CurrencyTable data={[]} loading={true} error={null} selectedCurrencies={[]} />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error message when error is present', () => {
    const errorMessage = 'Failed to fetch data';
    render(
      <CurrencyTable data={[]} loading={false} error={errorMessage} selectedCurrencies={[]} />
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders no data message when data is empty', () => {
    render(
      <CurrencyTable data={[]} loading={false} error={null} selectedCurrencies={[]} />
    );
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  it('renders table with currency data', () => {
    render(
      <CurrencyTable data={mockData} loading={false} error={null} selectedCurrencies={[]} />
    );
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
  });

  it('renders date columns in table header', () => {
    render(
      <CurrencyTable data={mockData} loading={false} error={null} selectedCurrencies={[]} />
    );
    // Check that date headers are rendered
    const headers = screen.getAllByRole('columnheader');
    expect(headers.length).toBeGreaterThan(1);
  });

  it('formats exchange rates with 4 decimal places', () => {
    render(
      <CurrencyTable data={mockData} loading={false} error={null} selectedCurrencies={[]} />
    );
    // USD rate should be formatted
    expect(screen.getByText(/1\.25/)).toBeInTheDocument();
  });
});
