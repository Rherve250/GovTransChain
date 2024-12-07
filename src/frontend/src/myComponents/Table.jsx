import React, { useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button } from "../components/ui/button";
import { FaPlus } from "react-icons/fa";

// Dialog Components
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

// Popover Components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// React Router Link for navigation
import { Link } from "react-router-dom";

const data = [
  {
    id: "1",
    Name: "Gira inka",
    CreatedBy: "rutagarama",
    LocalLeaders: "10",
    RequestCitizens: "30",
    Citizens: "30",
    Beneficials: "40",
    Description: "gira inka munyarwanda",
    CreatedAt: '23-02-2024',
    UpdatedAt: "23-02-2024"
  },
];

const Table = () => {
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
    {
      field: "RequestCitizens",
      headerName: "Requests",
      width: 150,
      renderCell: (params) => (
        <Link
          to={`/Admin/Programs/${params.row.id}/Request`}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {params.row.RequestCitizens}
        </Link>
      ),
    },
    { field: "Citizens", headerName: "Citizens", width: 150 },
    { field: "Beneficials", headerName: "Beneficials", width: 150 },
    { field: "Description", headerName: "Description", width: 150 },
    { field: "CreatedAt", headerName: "CreatedAt", width: 150 },
    { field: "UpdatedAt", headerName: "UpdatedAt", width: 150 },
    {
      field: "Add Leader",
      headerName: "Add Leader",
      renderCell: () => (
        <Box>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Add Leader</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[95%]">
              <div className="grid gap-4">
                <h4 className="font-medium leading-none">Local Leader</h4>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Select onValueChange={() => {}}>
                      <SelectTrigger className="w-full">
                        <SelectValue className="px-9" placeholder="Local Leader" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="w-full" value="Male">Rugarama</SelectItem>
                        <SelectItem value="Female">Mugisha</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button></Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </Box>
      ),
    }
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
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Beneficials" className="text-right">Beneficials</Label>
                <Input id="Beneficials" type="number" className="col-span-3" placeholder="0" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="Description" className="text-right">Description</Label>
                <Textarea className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
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

export default Table;