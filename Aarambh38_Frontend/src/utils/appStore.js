import {configureStore} from "@reduxjs/toolkit"
import verifyuserreducer from "./EmailSlice"
import studentReducer from "./StudentSlice"
import aluminiReducer from "./AluminiSlice"
import adminReducer from "./AdminSlice"
const appStore=configureStore({
    reducer:{
        verifyuser:verifyuserreducer,
        studentdata:studentReducer,
        aluminidata:aluminiReducer,
        admindata:adminReducer,
    }
})

export default appStore