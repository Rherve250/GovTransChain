import React, { useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button } from "../../components/ui/button";
import { FaPlus } from "react-icons/fa";

// Dialog Components
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

// Popover Components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// React Router Link for navigation
import { Link } from "react-router-dom";

const data = [
  {
    id: "1",
    ProgramId: "wder-12df-34-f-sdfaa-",
    StockName: "fertilizer",
    Quantity: "10",
    RemainingStock: "30",
    CreatedAt: '23-02-2024',
    UpdatedAt: "23-02-2024"
  },
];

const StockTable = () => {
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
    { field: "ProgramId", headerName: "ProgramId", width: 150 },
    { field: "StockName", headerName: " Stock Name", width: 150 },
    {
      field: "Quantity",
      headerName: "Quantity",
      width: 150
    },
    {
      field: "RemainingStock",
      headerName: "RemainingStock",
      width: 150,
      // renderCell: (params) => (
      //   <Link
      //     to={`/Programs/${params.row.id}/Request`}
      //     style={{ color: "blue", textDecoration: "underline" }}
      //   >
      //     {params.row.RequestCitizens}
      //   </Link>
      // ),
    },
    { field: "CreatedAt", headerName: "CreatedAt", width: 150 },
    { field: "UpdatedAt", headerName: "UpdatedAt", width: 150 },
  ];

  return (
    <>
      <div className="flex justify-end mb-3 font-bold">
        <Dialog>
          <DialogTrigger asChild>
            <Button><FaPlus /> New Program</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Program</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Program</Label>
                <Select onValueChange={() => {}}>
                      <SelectTrigger className="w-full">
                        <SelectValue className="px-9" placeholder="Local Leader" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="w-full" value="Male">Gira Inka</SelectItem>
                        <SelectItem value="Female">Karongi Relief</SelectItem>
                      </SelectContent>
                    </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="StockName" className="text-right">Stock Name</Label>
                <Input id="StockName" type="text" className="col-span-3" placeholder="Name of item" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Description" className="text-right">Quantity</Label>
                <Input id="Beneficials" type="number" className="col-span-3" placeholder="0" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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

export default StockTable;