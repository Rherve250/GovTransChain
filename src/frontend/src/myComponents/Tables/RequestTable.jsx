import React, { useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button } from "../../components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

const data = [
  {
    id: "1",
    Name: "Gira inka",
    CreatedBy: "rutagarama",
    LocalLeaders: "10",
    Citizens: "30",
    Beneficials: "40",
    Description: "gira inka munyarwanda",
    CreatedAt: '23-02-2024',
    UpdatedAt: "23-02-2024"
  },
];

const RequestTable = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openCreator, setOpenCreator] = useState(false);
  const [value, setValue] = useState(0);

  const handleCreatorOpen = () => setOpenCreator(true);
  const handleCreatorClose = () => setOpenCreator(false);

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "Name", headerName: "Program Name", width: 150 },
    { field: "CreatedBy", headerName: "Username1", width: 150 },
    {
      field: "LocalLeaders",
      headerName: "Local Leaders",
      width: 150
    },
    { field: "Citizens", headerName: "Citizens", width: 150 },
    { field: "Beneficials", headerName: "Beneficials", width: 150 },
    { field: "Description", headerName: "Description", width: 150 },
    { field: "CreatedAt", headerName: "CreatedAt", width: 150 },
    { field: "UpdatedAt", headerName: "UpdatedAt", width: 150 },
  ];

  return (
    <>
  

      <Box
        sx={{
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            // Customize toolbar button styles
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          slots={{
            toolbar: GridToolbar,
          }}
          sx={{
            backgroundColor: '#f5f5f5', // Light gray background
            '& .MuiDataGrid-row': {
              backgroundColor: '#ffffff', // White row background
              '&:nth-of-type(odd)': {
                backgroundColor: '#f9f9f9', // Alternate row color
              },
            },
            boxShadow: '0 4px 10px rgba(200, 200, 200, 0.7)',
            borderRadius: '8px',
            border: '1px solid #ddd',
          }}
        />
      </Box>
    </>
  );
};

export default RequestTable;