import React, {  useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";


// Form Get stock
import { useDispatch,useSelector} from "react-redux";
import TableSkeleton from "../skeletors/tableSkeletor";
import { GetStoreThunk } from "@/Redux/action/MyStock";
import DistributePop from "./DistributePop";



const LeaderStockTable = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(GetStoreThunk())
  },[dispatch])


  const columns = [
    { field: "StockId", headerName: "Stock Id", width: 100 },
    { field: "ProgramId", headerName: "Program Id", width: 150 },
    { field: "StockName", headerName: " Stock Name", width: 150 },
    {
      field: "Quantity",
      headerName: "Quantity",
      width: 150
    },
    {
      field: "Action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <DistributePop ProgramId={params.row.ProgramId} StockId={params.row.StockId} key={params.row.StockId} />
      ),
    },
   
   
  ];
    const  {  loading, GetStore, errorz } = useSelector((state)=>state.GetStore)
  return (
    <>
      <div className="flex justify-end mb-3 font-bold">
      </div>

      <Box
        sx={{
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            // Customize toolbar button styles
          },
        }}
      >
       {loading?
     (<div style={{textAlign: "center"}}>
      <TableSkeleton />
   </div>):  
   (GetStore?.length  === 0|| errorz)?(
    <div style={{textAlign: "center"}}>
          <p>No Stock or there is error! Reload</p>
    </div>
  ):(
    <DataGrid
    getRowId={(row)=>(row.StockId)}
    rows={GetStore}
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
      )
      }
      </Box>
    </>
  );
};

export default LeaderStockTable;