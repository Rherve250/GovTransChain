import { createSlice } from "@reduxjs/toolkit";
import { ProfileStatsThunk } from "../action/ProfileStats";

const initialState = {
    loadingS: false,
    ProfileStats: null,
    ErrorZ: null,
}

const ProfileStatsSlice= createSlice({
    name: "ProfileStats",
    initialState,
    reducers: {

    },

    extraReducers: {
      [ProfileStatsThunk.pending] : (state) =>{
        return{
            ...state,
            loadingS: true
        }
      },
      [ProfileStatsThunk.rejected]:(state,{payload}) =>{
        return {
            ...state,
            loadingS:false,
            ErrorZ:payload
        }
      },
      [ProfileStatsThunk.fulfilled]: (state,{payload}) => {
        return {
            ...state,
            loadingS: false,
            ProfileStats: payload
        }
      }  
    }
})

export default  ProfileStatsSlice.reducer