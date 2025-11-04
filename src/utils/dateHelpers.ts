export const getLastSevenDays = (selectedDate: Date): Date[] => {
    const dates: Date[] = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() - i);
        // Ensure it's a valid date
        if (!isNaN(date.getTime())) {
            dates.push(date);
        }
    }
    return dates;
};

export const getMaxPastDate = (maxDays: number = 90): Date => {
    const today = new Date();
    const maxPast = new Date(today);
    maxPast.setDate(maxPast.getDate() - maxDays);
    return maxPast;
};
