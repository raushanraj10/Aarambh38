import { createSlice } from "@reduxjs/toolkit";
import { Verified } from "lucide-react";

const EmailSlice=createSlice({
    name:"verifyuser",
    initialState:null,
    reducers:{
       pendinguser:(state,action)=>{
        return action.payload
       },
       Verifieduser:()=>null
    }
})

export const {pendinguser,Verifieduser}=EmailSlice.actions
export default EmailSlice.reducer;