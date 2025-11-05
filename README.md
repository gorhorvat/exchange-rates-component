# Exchange Rates Component

A small React + TypeScript component that displays historical exchange rates in a table. It uses Vite for bundling, Redux Toolkit for state, and Jest + Testing Library for tests.

🌐 [Live Demo](https://gorhorvat.github.io/exchange-rates-component/)

## Libraries used

- React ^19
- TypeScript
- Vite
- Redux Toolkit (@reduxjs/toolkit)
- react-redux
- axios
- [MUI](https://mui.com/) (@mui/material, @mui/x-data-grid)
- @emotion/react, @emotion/styled
- date-fns
- react-day-picker

Dev / test tooling

- Jest
- ts-jest
- @testing-library/react, @testing-library/jest-dom
- ESLint, Prettier

## Getting started

1. Clone the repo and change into the project folder:

```powershell
git clone <repo-url>
cd "exchange-rates-component"
```

2. Install dependencies:

```powershell
npm install
```

3. Run the development server:

```powershell
npm run dev
```

4. Build for production:

```powershell
npm run build
```

## Tests

Run the full test suite with:

```powershell
npm test
```

Run tests in watch mode:

```powershell
npm run test:watch
```

Generate coverage report:

```powershell
npm run test:coverage
```

Coverage output will be written to the `coverage/` folder.

### Test Coverage

The project maintains excellent test coverage across all components, hooks, services, and utilities:

```
---------------------------|---------|----------|---------|---------|-------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------------|---------|----------|---------|---------|-------------------
All files                  |     100 |    84.05 |     100 |     100 |                  
 components                |     100 |       90 |     100 |     100 |                  
  BaseCurrencySelector.tsx |     100 |      100 |     100 |     100 |                  
  CurrencySelector.tsx     |     100 |    81.25 |     100 |     100 | 27-35            
  CurrencyTable.tsx        |     100 |      100 |     100 |     100 |                  
 constants                 |     100 |      100 |     100 |     100 |                  
  api.ts                   |     100 |      100 |     100 |     100 |                  
  app.ts                   |     100 |      100 |     100 |     100 |                  
  index.ts                 |     100 |      100 |     100 |     100 |                  
 hooks                     |     100 |    83.33 |     100 |     100 |                  
  useCurrencies.ts         |     100 |       75 |     100 |     100 | 34-35            
  useExchangeRateData.ts   |     100 |       90 |     100 |     100 | 77,82            
  useFetchExchangeRates.ts |     100 |       50 |     100 |     100 | 29               
 services                  |     100 |    66.66 |     100 |     100 |                  
  currencyService.ts       |     100 |    66.66 |     100 |     100 | 17,47            
  index.ts                 |     100 |      100 |     100 |     100 |                  
 utils                     |     100 |    66.66 |     100 |     100 |                  
  dateHelpers.ts           |     100 |    66.66 |     100 |     100 | 24               
---------------------------|---------|----------|---------|---------|-------------------

Test Suites: 8 passed, 8 total
Tests:       102 passed, 102 total
```

**Summary:**
- ✅ **100% Statement Coverage**
- ✅ **100% Function Coverage**
- ✅ **100% Line Coverage**
- ✅ **84.05% Branch Coverage**
- ✅ **102 Tests Passing**

## Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. You can also deploy manually:

```powershell
npm run deploy
```

This will:
1. Build the project
2. Deploy to GitHub Pages
3. Make it available at https://gorhorvat.github.io/exchange-rates-component/

To deploy locally:
1. Install gh-pages if not already installed: `npm install --save-dev gh-pages`
2. Run the deploy script: `npm run deploy`

## Notes

- If tests mock `axios`, ensure any changes to how `axios` is imported remain compatible with `jest.mock('axios')` used in the test suite.
- The project uses date strings in `YYYY-MM-DD` format for API endpoints.

If you'd like, I can also add a short CONTRIBUTING or DEVELOPMENT section describing linting and commit hooks, or expand the README with screenshots and a live demo link.
