import { createSlice } from "@reduxjs/toolkit";
import { Verified } from "lucide-react";

const StudentSlice=createSlice({
    name:"studentdata",
    initialState:null,
    reducers:{
       addstudent:(state,action)=>{
        return action.payload
       },
       removestudent:()=>null,
    }
})

export const {addstudent,removestudent}=StudentSlice.actions
export default StudentSlice.reducer;