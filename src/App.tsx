import React from 'react';
import { Provider } from 'react-redux';
import { Container, Box, Typography, Paper } from '@mui/material';
import { store } from './store/store';
import CurrencyExchangeRates from './components/CurrencyExchangeRates';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold' }}
          >
            Currency Exchange Rate Tracker
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}
          >
            Track historical exchange rates for up to 90 days in the past
          </Typography>
          <Paper elevation={3} sx={{ p: 3 }}>
            <CurrencyExchangeRates />
          </Paper>
        </Box>
      </Container>
    </Provider>
  );
};

export default App;
