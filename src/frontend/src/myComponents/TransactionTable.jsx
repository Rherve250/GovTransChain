import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

// Sample Data
const transactions = [
  {
    TransactionId: 'T1',
    StockId: 'S1',
    SenderId: 'abc-123',
    ReceiverId: 'user-456',
    Quantity: 50,
    TransactionType: 'TRANSFER',
    Status: 'COMPLETED',
  },
  {
    TransactionId: 'T2',
    StockId: 'S2',
    SenderId: 'def-789',
    ReceiverId: 'user-101',
    Quantity: 20,
    TransactionType: 'PURCHASE',
    Status: 'PENDING',
  },
  {
    TransactionId: 'T3',
    StockId: 'S3',
    SenderId: 'ghi-234',
    ReceiverId: 'user-789',
    Quantity: 75,
    TransactionType: 'SALE',
    Status: 'CANCELLED',
   
  },
];

// Columns Definition
const columns = [
  { field: 'TransactionId', headerName: 'Transaction ID', flex: 1 },
  { field: 'StockId', headerName: 'Stock ID', flex: 1 },
  { field: 'SenderId', headerName: 'Sender ID', flex: 1 },
  { field: 'ReceiverId', headerName: 'Receiver ID', flex: 1 },
  { field: 'Quantity', headerName: 'Quantity', type: 'number', flex: 1 },
  { field: 'TransactionType', headerName: 'Transaction Type', flex: 1 },
  {
    field: 'Status',
    headerName: 'Status',
    flex: 1,
    renderCell: (params) => {
      const statusColors = {
        COMPLETED: 'green',
        PENDING: 'orange',
        CANCELLED: 'red',
      };
      return (
        <Box
          component="span"
          sx={{
            color: statusColors[params.value],
            fontWeight: 'bold',
          }}
        >
          {params.value}
        </Box>
      );
    },
  },
];

const TransactionTable = () => {
  return (
    <div className="col-span-full">

<Box sx={{ height: 400, width: '100%', backgroundColor: 'white', p: 2, boxShadow: 2 }}>
      <h2>Transaction Table</h2>
      <DataGrid
        rows={transactions.map((transaction, index) => ({ id: index + 1, ...transaction }))}
        columns={columns}
        disableSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        sortingOrder={['asc', 'desc']}
      />
    </Box>
    </div>
  );
};

export default TransactionTable;
