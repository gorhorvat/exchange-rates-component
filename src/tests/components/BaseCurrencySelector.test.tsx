// tests/BaseCurrencySelector.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BaseCurrencySelector from '../../components/BaseCurrencySelector';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BaseCurrencySelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: {
        gbp: 'British Pound',
        usd: 'US Dollar',
        eur: 'Euro',
        jpy: 'Japanese Yen',
      },
    });
  });

  it('renders currency selector', async () => {
    render(
      <BaseCurrencySelector
        selectedCurrency="GBP"
        onCurrencyChange={mockOnChange}
      />
    );

    // Wait for API to finish loading
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('loads and displays available currencies', async () => {
    render(
      <BaseCurrencySelector
        selectedCurrency="GBP"
        onCurrencyChange={mockOnChange}
      />
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('currencies.json')
      );
    });
  });

  it('displays the selected currency', async () => {
    render(
      <BaseCurrencySelector
        selectedCurrency="GBP"
        onCurrencyChange={mockOnChange}
      />
    );

    // Wait for combobox to be ready
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    // Check if selected value is displayed
    expect(screen.getByDisplayValue('GBP')).toBeInTheDocument();
  });

  it('calls onCurrencyChange when currency is selected', async () => {
    const user = userEvent.setup();
    render(
      <BaseCurrencySelector
        selectedCurrency="GBP"
        onCurrencyChange={mockOnChange}
      />
    );

    // Wait for API to finish and combobox to be available
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    
    // Click to open dropdown
    await user.click(select);

    // Find and click a menu item
    const eurOption = await screen.findByRole('option', { name: /EUR/ });
    await user.click(eurOption);

    // Verify callback was called
    expect(mockOnChange).toHaveBeenCalledWith('EUR');
  });

  it('displays error gracefully if API fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    render(
      <BaseCurrencySelector
        selectedCurrency="GBP"
        onCurrencyChange={mockOnChange}
      />
    );

    // Wait for API call to fail
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    // Component should still render without crashing
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
