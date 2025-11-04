import React, { useMemo } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, CircularProgress, Alert } from '@mui/material';
import { CurrencyTableProps } from '../types/currency.types';

const CurrencyTable: React.FC<CurrencyTableProps> = ({
    data,
    loading,
    error,
}) => {
    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    const columns: GridColDef[] = useMemo(() => {
        if (data.length === 0) return [];

        const cols: GridColDef[] = [
            {
                field: 'currency',
                headerName: 'Currency',
                width: 130,
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
                headerName: new Date(dateKey).toLocaleDateString('en-GB'),
                width: 120,
            });
        });

        return cols;
    }, [data]);

    return (
        <Box sx={{ height: 500, width: '100%' }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                </Box>
            ) : data.length === 0 ? (
                <Alert severity="info">No data available for the selected criteria</Alert>
            ) : (
                <DataGrid
                    rows={data}
                    columns={columns}
                    disableRowSelectionOnClick
                    hideFooter
                    sx={{
                        '& .MuiDataGrid-cell': {
                            fontSize: '0.875rem',
                        },
                    }}
                />
            )}
        </Box>
    );
};

export default CurrencyTable;
