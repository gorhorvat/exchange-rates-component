import { APP_CONFIG } from '../constants';

/**
 * Date utility functions
 * All helpers operate in UTC to avoid local timezone shifts when formatting dates
 */

/**
 * Gets the last seven days from a selected date (including the selected date)
 * @param selectedDate - The end date for the range
 * @returns Array of dates in UTC
 */
export const getLastSevenDays = (selectedDate: Date): Date[] => {
    const dates: Date[] = [];

    // Use UTC year/month/day to avoid timezone offsets shifting the date string
    const year = selectedDate.getUTCFullYear();
    const month = selectedDate.getUTCMonth();
    const day = selectedDate.getUTCDate();

    for (let i = APP_CONFIG.DATE.HISTORY_DAYS - 1; i >= 0; i--) {
        const d = new Date(Date.UTC(year, month, day));
        d.setUTCDate(d.getUTCDate() - i);
        if (!isNaN(d.getTime())) {
            dates.push(d);
        }
    }

    return dates;
};

/**
 * Calculates the maximum past date allowed based on max days back
 * @param maxDays - Maximum number of days in the past (default from config)
 * @returns Date representing the earliest allowed date in UTC
 */
export const getMaxPastDate = (maxDays: number = APP_CONFIG.DATE.MAX_PAST_DAYS): Date => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();

    const maxPast = new Date(Date.UTC(year, month, day));
    maxPast.setUTCDate(maxPast.getUTCDate() - maxDays);
    return maxPast;
};
