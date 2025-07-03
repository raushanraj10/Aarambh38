import { createSlice } from "@reduxjs/toolkit";
import { Verified } from "lucide-react";

const EmailSlice=createSlice({
    name:"verifyuser",
    initialState:null,
    reducers:{
       pendinguser:(state,action)=>{
        return action.payload
       },
       Verifieduser:()=>null,

       updateCode: (state, action) => {
      state.code = action.payload;
    },
    }
})

export const {pendinguser,Verifieduser,updateCode}=EmailSlice.actions
export default EmailSlice.reducer;