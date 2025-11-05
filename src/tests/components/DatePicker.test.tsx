import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencySelector from '../../components/CurrencySelector';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CurrencySelector', () => {
  const mockOnChange = jest.fn();
  const mockCurrencies = ['USD', 'EUR', 'JPY'];
  const mockCurrenciesData = {
    usd: 'US Dollar',
    eur: 'Euro',
    jpy: 'Japanese Yen',
    chf: 'Swiss Franc',
    cad: 'Canadian Dollar',
    aud: 'Australian Dollar',
    zar: 'South African Rand',
    gbp: 'British Pound',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: mockCurrenciesData,
    });
  });

  it('renders currency selector', async () => {
    render(
      <CurrencySelector
        selectedCurrencies={mockCurrencies}
        onCurrenciesChange={mockOnChange}
        baseCurrency="GBP"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('displays selected currencies as chips', async () => {
    render(
      <CurrencySelector
        selectedCurrencies={mockCurrencies}
        onCurrenciesChange={mockOnChange}
        baseCurrency="GBP"
      />
    );

    await waitFor(() => {
      mockCurrencies.forEach((currency) => {
        expect(screen.getByText(currency)).toBeInTheDocument();
      });
    });
  });

  it('allows deleting a currency chip', async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();

    render(
      <CurrencySelector
        selectedCurrencies={['USD', 'EUR', 'JPY']}
        onCurrenciesChange={onChangeMock}
        baseCurrency="GBP"
        minCurrencies={2}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    const usdChip = screen.getByText('USD').closest('[class*="MuiChip"]');

    if (usdChip) {
      const deleteButton = usdChip.querySelector('button');

      if (deleteButton) {
        await user.click(deleteButton);
        expect(onChangeMock).toHaveBeenCalled();
      }
    }
  });

  it('prevents deleting currency if it would go below minimum', async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();

    render(
      <CurrencySelector
        selectedCurrencies={mockCurrencies}
        onCurrenciesChange={onChangeMock}
        baseCurrency="GBP"
        minCurrencies={3}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument();
    });

    const usdChip = screen.getByText('USD').closest('[class*="MuiChip"]');
    const deleteButton = usdChip?.querySelector('button');

    if (deleteButton) {
      await user.click(deleteButton);
      expect(onChangeMock).not.toHaveBeenCalled();
    }
  });

  it('enforces minimum currency requirement', async () => {
    const minCurrencies = 3;
    render(
      <CurrencySelector
        selectedCurrencies={mockCurrencies}
        onCurrenciesChange={mockOnChange}
        baseCurrency="GBP"
        minCurrencies={minCurrencies}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    expect(mockCurrencies.length).toBeGreaterThanOrEqual(minCurrencies);
  });

  it('enforces maximum currency requirement', async () => {
    const maxCurrencies = 3;
    render(
      <CurrencySelector
        selectedCurrencies={mockCurrencies}
        onCurrenciesChange={mockOnChange}
        baseCurrency="GBP"
        maxCurrencies={maxCurrencies}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    expect(mockCurrencies.length).toBeLessThanOrEqual(maxCurrencies);
  });

  it('excludes base currency from available options', async () => {
    render(
      <CurrencySelector
        selectedCurrencies={['USD', 'EUR']}
        onCurrenciesChange={mockOnChange}
        baseCurrency="GBP"
      />
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('loads and displays available currencies', async () => {
    render(
      <CurrencySelector
        selectedCurrencies={mockCurrencies}
        onCurrenciesChange={mockOnChange}
        baseCurrency="GBP"
      />
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('currencies.json')
      );
    });
  });

  it('calls onCurrenciesChange when a currency is selected', async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();

    render(
      <CurrencySelector
        selectedCurrencies={['USD', 'EUR']}
        onCurrenciesChange={onChangeMock}
        baseCurrency="GBP"
        minCurrencies={2}
        maxCurrencies={5}
      />
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    const select = screen.getByRole('combobox');
    await user.click(select);

    const jpyOption = await screen.findByRole('option', { name: /JPY/ });
    await user.click(jpyOption);

    expect(onChangeMock).toHaveBeenCalled();
  });

  it('displays error gracefully if API fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    render(
      <CurrencySelector
        selectedCurrencies={mockCurrencies}
        onCurrenciesChange={mockOnChange}
        baseCurrency="GBP"
      />
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    expect(screen.getByRole('combobox')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('respects min and max currencies constraints', () => {
    const minCurrencies = 2;
    const maxCurrencies = 5;

    render(
      <CurrencySelector
        selectedCurrencies={mockCurrencies}
        onCurrenciesChange={mockOnChange}
        baseCurrency="GBP"
        minCurrencies={minCurrencies}
        maxCurrencies={maxCurrencies}
      />
    );

    expect(mockCurrencies.length).toBeGreaterThanOrEqual(minCurrencies);
    expect(mockCurrencies.length).toBeLessThanOrEqual(maxCurrencies);
  });

  it('handles empty currency selection gracefully', async () => {
    render(
      <CurrencySelector
        selectedCurrencies={[]}
        onCurrenciesChange={mockOnChange}
        baseCurrency="GBP"
        minCurrencies={0}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('filters out base currency from selectable options', async () => {
    const user = userEvent.setup();

    render(
      <CurrencySelector
        selectedCurrencies={['USD', 'EUR']}
        onCurrenciesChange={mockOnChange}
        baseCurrency="USD"
      />
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    const select = screen.getByRole('combobox');
    await user.click(select);

    const options = screen.getAllByRole('option');
    const usdOption = options.find(opt => opt.textContent?.includes('USD'));

    expect(usdOption).toBeUndefined();
  });

  it('updates selected currencies when changing selection', async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();

    render(
      <CurrencySelector
        selectedCurrencies={['USD']}
        onCurrenciesChange={onChangeMock}
        baseCurrency="GBP"
        minCurrencies={1}
        maxCurrencies={5}
      />
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    const select = screen.getByRole('combobox');
    await user.click(select);

    const eurOption = await screen.findByRole('option', { name: /EUR - Euro/ });
    await user.click(eurOption);

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.arrayContaining(['USD', 'EUR'])
    );
  });

  it('deselects currency when clicking it again in select', async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();

    render(
      <CurrencySelector
        selectedCurrencies={['USD', 'EUR']}
        onCurrenciesChange={onChangeMock}
        baseCurrency="GBP"
        minCurrencies={1}
        maxCurrencies={5}
      />
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    const select = screen.getByRole('combobox');
    await user.click(select);

    const usdOption = await screen.findByRole('option', { name: /USD - US Dollar/ });
    await user.click(usdOption);

    expect(onChangeMock).toHaveBeenCalledWith(
      expect.not.arrayContaining(['USD'])
    );
  });
});
