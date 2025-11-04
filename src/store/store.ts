import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from './slices/currencySlice';

export const store = configureStore({
    reducer: {
        currency: currencyReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['currency/setSelectedDate'],
                ignoredPaths: ['currency.selectedDate'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
