import { createAsyncThunk } from "@reduxjs/toolkit";
import { ToastError, ToastSuccess } from "../../utils/toast";
import { AddLeaderToProgram } from "@/utils/endpoints";
import {logout } from "../../utils/auth"

export const AddLeaderToProgramThunk = createAsyncThunk("AddLeaderToProgram",
async(data,{rejectWithValue})=>{
    try{

        const  {ProgramId,LeaderId} =data;
       const repo = await AddLeaderToProgram(ProgramId,LeaderId);
       if(repo.Ok){
        ToastSuccess("Added!!")
        return repo.Ok
       }else if(repo.Err){
        {repo.Err.Error && ToastError(repo.Err.Error)}
        {repo.Err.NotFound && ToastError(repo.Error.NotFound)}
        {repo.Err.NoProfile&& ( ToastError(repo.Err.NoProfile),
            setTimeout(async()=>{
                await logout()
                window.location.href="/"
            }, 3000))}
        {repo.Err.Unauthorized&& ( ToastError(repo.Err.Unauthorized),
            setTimeout(async()=>{
                  await logout()
                window.location.href="/"}, 
                3000))} 
        return rejectWithValue(repo.Err)
       }

    }catch(error){
        return rejectWithValue(error.Err)
    }
}
);