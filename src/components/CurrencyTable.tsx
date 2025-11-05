import React, { useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, CircularProgress, Alert } from '@mui/material';
import { CurrencyTableProps } from '../types/currency.types';
import { APP_CONFIG, ERROR_MESSAGES } from '../constants';

const CurrencyTable: React.FC<CurrencyTableProps> = ({
    data,
    loading,
    error,
}) => {
    /**
     * Memoized column definitions for the DataGrid
     * Dynamically generates date columns based on data structure
     */
    const columns: GridColDef[] = useMemo(() => {
        if (data.length === 0) return [];

        const cols: GridColDef[] = [
            {
                field: 'currency',
                headerName: 'Currency',
                width: APP_CONFIG.TABLE.COLUMN_WIDTH.CURRENCY,
                sortable: true,
            },
        ];

        // Get all date columns from the first row
        const firstRow = data[0];
        const dateKeys = Object.keys(firstRow)
            .filter((key) => key !== 'id' && key !== 'currency')
            .sort();

        dateKeys.forEach((dateKey) => {
            cols.push({
                field: dateKey,
                headerName: new Date(dateKey).toLocaleDateString(APP_CONFIG.DATE.LOCALE),
                width: APP_CONFIG.TABLE.COLUMN_WIDTH.DATE,
            });
        });

        return cols;
    }, [data]);

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={APP_CONFIG.TABLE.HEIGHT}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (data.length === 0) {
        return <Alert severity="info">{ERROR_MESSAGES.NO_DATA_AVAILABLE}</Alert>;
    }

    return (
        <Box sx={{ height: APP_CONFIG.TABLE.HEIGHT, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                disableRowSelectionOnClick
                hideFooter
            />
        </Box>
    );
};

export default CurrencyTable;
