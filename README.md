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
