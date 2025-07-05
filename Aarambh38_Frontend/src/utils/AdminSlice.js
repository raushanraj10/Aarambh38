import { createSlice } from "@reduxjs/toolkit";
import { Verified } from "lucide-react";

const AdminSlice=createSlice({
    name:"admindata",
    initialState:null,
    reducers:{
       addadmin:(state,action)=>{
        return action.payload
       },
       removeadmin:()=>null,
    }
})

export const {addadmin,removeadmin}=AdminSlice.actions
export default AdminSlice.reducer;