import { createAsyncThunk } from "@reduxjs/toolkit";
import { ToastError } from "../../utils/toast";
import { userProfileStats } from "@/utils/endpoints";

export const ProfileStatsThunk = createAsyncThunk("userProfileStats",
async(data,{rejectWithValue})=>{
    try{
       const repo = await userProfileStats();
       if(repo.Ok){
        return repo.Ok
       }else if(repo.Err){
        {repo.Err.Error && ToastError(repo.Err.Error)}
        return rejectWithValue(repo.Err)
       }

    }catch(error){
        return rejectWithValue(error.Err)
    }
}
);