// Helpers operate in UTC to avoid local timezone shifts when formatting dates
export const getLastSevenDays = (selectedDate: Date): Date[] => {
    const dates: Date[] = [];

    // Use UTC year/month/day to avoid timezone offsets shifting the date string
    const year = selectedDate.getUTCFullYear();
    const month = selectedDate.getUTCMonth();
    const day = selectedDate.getUTCDate();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.UTC(year, month, day));
        d.setUTCDate(d.getUTCDate() - i);
        if (!isNaN(d.getTime())) {
            dates.push(d);
        }
    }

    return dates;
};

export const getMaxPastDate = (maxDays: number = 90): Date => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();

    const maxPast = new Date(Date.UTC(year, month, day));
    maxPast.setUTCDate(maxPast.getUTCDate() - maxDays);
    return maxPast;
};
