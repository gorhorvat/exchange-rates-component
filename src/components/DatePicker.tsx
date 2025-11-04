import React from 'react';
import { Box, TextField } from '@mui/material';
import { DatePickerProps } from '../types/currency.types';
import { getMaxPastDate } from '../utils/dateHelpers';

const DatePickerComponent: React.FC<DatePickerProps> = ({
    selectedDate,
    onDateChange,
    maxPastDays = 90,
}) => {
    const maxPastDate = getMaxPastDate(maxPastDays);
    const today = new Date();

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const dateString = event.target.value;

        if (!dateString) {
            return; // Don't call callback for empty input
        }

        const newDate = new Date(dateString);

        // Validate date is within the allowed range
        if (newDate >= maxPastDate && newDate <= today) {
            onDateChange(newDate);
        }
        // If date is outside range, don't call callback
    };

    const formatDateForInput = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    return (
        <Box>
            <TextField
                label="Select Date"
                type="date"
                value={formatDateForInput(selectedDate)}
                onChange={handleDateChange}
                slotProps={{ htmlInput: { min: formatDateForInput(maxPastDate), max: formatDateForInput(today) }, inputLabel: { shrink: true } }}
                fullWidth
            />
        </Box>
    );
};

export default DatePickerComponent;
