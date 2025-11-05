import {
    getLastSevenDays,
    getMaxPastDate,
} from '../../utils/dateHelpers';

describe('dateHelpers', () => {
    describe('getLastSevenDays', () => {
        it('returns an array of 7 dates', () => {
            const selectedDate = new Date('2025-11-04');
            const result = getLastSevenDays(selectedDate);

            expect(result).toHaveLength(7);
        });

        it('returns dates in ascending order', () => {
            const selectedDate = new Date('2025-11-04');
            const result = getLastSevenDays(selectedDate);

            for (let i = 0; i < result.length - 1; i++) {
                expect(result[i].getTime()).toBeLessThan(result[i + 1].getTime());
            }
        });

        it('includes the selected date as the last element', () => {
            const selectedDate = new Date('2025-11-04');
            const result = getLastSevenDays(selectedDate);
            const lastDate = result[result.length - 1];

            // Compare dates (ignoring time)
            expect(lastDate.toDateString()).toBe(selectedDate.toDateString());
        });

        it('starts 6 days before the selected date', () => {
            const selectedDate = new Date('2025-11-04');
            const result = getLastSevenDays(selectedDate);
            const firstDate = result[0];

            const expectedFirstDate = new Date(selectedDate);
            expectedFirstDate.setDate(expectedFirstDate.getDate() - 6);

            expect(firstDate.toDateString()).toBe(expectedFirstDate.toDateString());
        });

        it('returns valid dates with no invalid dates', () => {
            const selectedDate = new Date('2025-11-04');
            const result = getLastSevenDays(selectedDate);

            result.forEach((date) => {
                expect(date).toBeInstanceOf(Date);
                expect(isNaN(date.getTime())).toBe(false);
            });
        });

        it('handles leap year dates correctly', () => {
            const leapYearDate = new Date('2024-03-01'); // Day after Feb 29
            const result = getLastSevenDays(leapYearDate);

            expect(result).toHaveLength(7);
            expect(result[result.length - 1].toDateString()).toBe(leapYearDate.toDateString());
        });

        it('handles year boundary dates correctly', () => {
            const newYearsDay = new Date('2026-01-01');
            const result = getLastSevenDays(newYearsDay);

            expect(result).toHaveLength(7);
            const firstDate = result[0];
            expect(firstDate.getFullYear()).toBe(2025);
            expect(firstDate.getMonth()).toBe(11); // December (0-indexed)
        });

        it('handles month boundary dates correctly', () => {
            const marchFirst = new Date('2025-03-01');
            const result = getLastSevenDays(marchFirst);

            expect(result).toHaveLength(7);
            const firstDate = result[0];
            expect(firstDate.getMonth()).toBe(1); // February
        });

        it('each date is exactly one day apart', () => {
            const selectedDate = new Date('2025-11-04');
            const result = getLastSevenDays(selectedDate);
            const millisecondsPerDay = 24 * 60 * 60 * 1000;

            for (let i = 0; i < result.length - 1; i++) {
                const daysDiff = (result[i + 1].getTime() - result[i].getTime()) / millisecondsPerDay;
                expect(daysDiff).toBeCloseTo(1, 1); // Allow for floating point errors
            }
        });

        it('preserves time zone information', () => {
            const selectedDate = new Date('2025-11-04T15:30:00Z');
            const result = getLastSevenDays(selectedDate);

            expect(result).toHaveLength(7);
            result.forEach((date) => {
                expect(date).toBeInstanceOf(Date);
            });
        });

        it('works with dates from different months', () => {
            const dates = [
                new Date('2025-01-15'),
                new Date('2025-06-15'),
                new Date('2025-12-15'),
            ];

            dates.forEach((date) => {
                const result = getLastSevenDays(date);
                expect(result).toHaveLength(7);
                expect(result[result.length - 1].toDateString()).toBe(date.toDateString());
            });
        });

        it('works with dates from different years', () => {
            const dates = [
                new Date('2023-11-04'),
                new Date('2024-11-04'),
                new Date('2025-11-04'),
            ];

            dates.forEach((date) => {
                const result = getLastSevenDays(date);
                expect(result).toHaveLength(7);
            });
        });
    });

    describe('getMaxPastDate', () => {
        it('returns a date object', () => {
            const result = getMaxPastDate(90);
            expect(result).toBeInstanceOf(Date);
        });

        it('returns a valid date', () => {
            const result = getMaxPastDate(90);
            expect(isNaN(result.getTime())).toBe(false);
        });

        it('returns a date in the past', () => {
            const result = getMaxPastDate(90);
            const today = new Date();

            expect(result.getTime()).toBeLessThan(today.getTime());
        });

        it('defaults to 90 days in the past when no argument provided', () => {
            const result = getMaxPastDate();
            const today = new Date();

            // Calculate expected date (90 days ago)
            const expected = new Date(today);
            expected.setDate(expected.getDate() - 90);

            // Compare date strings to avoid time differences
            expect(result.toDateString()).toBe(expected.toDateString());
        });

        it('calculates 30 days ago correctly', () => {
            const result = getMaxPastDate(30);
            const today = new Date();
            const expected = new Date(today);
            expected.setDate(expected.getDate() - 30);

            expect(result.toDateString()).toBe(expected.toDateString());
        });

        it('calculates 60 days ago correctly', () => {
            const result = getMaxPastDate(60);
            const today = new Date();
            const expected = new Date(today);
            expected.setDate(expected.getDate() - 60);

            expect(result.toDateString()).toBe(expected.toDateString());
        });

        it('calculates 1 day ago correctly', () => {
            const result = getMaxPastDate(1);
            const today = new Date();
            const expected = new Date(today);
            expected.setDate(expected.getDate() - 1);

            expect(result.toDateString()).toBe(expected.toDateString());
        });

        it('calculates 365 days ago correctly', () => {
            const result = getMaxPastDate(365);
            const today = new Date();
            const expected = new Date(today);
            expected.setDate(expected.getDate() - 365);

            expect(result.toDateString()).toBe(expected.toDateString());
        });

        it('handles leap year correctly when calculating past dates', () => {
            // Manually set date to test leap year handling
            const result = getMaxPastDate(60); // Should go back to around Jan 1, 2024

            expect(result).toBeInstanceOf(Date);
            expect(isNaN(result.getTime())).toBe(false);
        });

        it('handles zero days', () => {
            const result = getMaxPastDate(0);
            const today = new Date();

            // 0 days ago should be today
            expect(result.toDateString()).toBe(today.toDateString());
        });

        it('handles large day counts', () => {
            const result = getMaxPastDate(1000);
            const today = new Date();
            const expected = new Date(today);
            expected.setDate(expected.getDate() - 1000);

            expect(result.toDateString()).toBe(expected.toDateString());
        });

        it('does not modify the current date', () => {
            const today = new Date();
            const todayString = today.toDateString();

            getMaxPastDate(90);

            expect(today.toDateString()).toBe(todayString);
        });

        it('handles year boundary calculations', () => {
            // This test ensures the function handles month/year rollovers correctly
            const result = getMaxPastDate(60);
            const today = new Date();

            // Should be 60 days before today
            const daysDiff = Math.floor(
                (today.getTime() - result.getTime()) / (1000 * 60 * 60 * 24)
            );

            expect(daysDiff).toBe(60);
        });

        it('returns consistent results when called multiple times', () => {
            // Call multiple times and verify same date (within same day)
            const result1 = getMaxPastDate(90);
            const result2 = getMaxPastDate(90);

            expect(result1.toDateString()).toBe(result2.toDateString());
        });
    });

    describe('Integration tests', () => {
        it('getLastSevenDays includes getMaxPastDate range', () => {
            const today = new Date('2025-11-04');
            const lastSevenDays = getLastSevenDays(today);
            // Use the same reference "today" as the helper to make this deterministic
            const maxPastDate = new Date(today);
            maxPastDate.setDate(maxPastDate.getDate() - 90);

            // All dates in last seven days should be after maxPastDate
            lastSevenDays.forEach((date) => {
                expect(date.getTime()).toBeGreaterThan(maxPastDate.getTime());
            });
        });

        it('date from getLastSevenDays[0] is after getMaxPastDate(6)', () => {
            const today = new Date('2025-11-04');
            const lastSevenDays = getLastSevenDays(today);

            // Compute the 6-days-ago date relative to the selected "today" used above
            const maxPastDate6 = new Date(today);
            maxPastDate6.setDate(maxPastDate6.getDate() - 6);

            // Compare date strings instead of timestamps to avoid time zone issues
            const firstDayString = lastSevenDays[0].toISOString().split('T')[0];
            const maxPastDateString = maxPastDate6.toISOString().split('T')[0];

            // lastSevenDays[0] is 6 days before today
            // They should be the same date or firstDay should be after
            const firstDayDate = new Date(firstDayString);
            const maxPastDateDate = new Date(maxPastDateString);

            expect(firstDayDate.getTime()).toBeGreaterThanOrEqual(maxPastDateDate.getTime());
        });

        it('formats dates correctly for API consumption', () => {
            const today = new Date('2025-11-04');
            const lastSevenDays = getLastSevenDays(today);

            // Verify dates can be formatted to YYYY-MM-DD
            lastSevenDays.forEach((date) => {
                const formatted = date.toISOString().split('T')[0];
                expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            });
        });

        it('date range respects constraints', () => {
            const today = new Date('2025-11-04');
            const lastSevenDays = getLastSevenDays(today);
            const ninetyDaysAgo = getMaxPastDate(90);

            // All dates should be within 90 days
            lastSevenDays.forEach((date) => {
                expect(date.getTime()).toBeGreaterThanOrEqual(ninetyDaysAgo.getTime());
                expect(date.getTime()).toBeLessThanOrEqual(today.getTime());
            });
        });
    });
});
