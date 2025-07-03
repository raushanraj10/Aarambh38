import { createSlice } from "@reduxjs/toolkit";
import { Verified } from "lucide-react";

const AluminiSlice=createSlice({
    name:"aluminidata",
    initialState:null,
    reducers:{
       addalumini:(state,action)=>{
        return action.payload
       },
       removealumini:()=>null,
    }
})

export const {addalumini,removealumini}=AluminiSlice.actions
export default AluminiSlice.reducer;