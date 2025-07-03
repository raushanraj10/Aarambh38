import {configureStore} from "@reduxjs/toolkit"
import verifyuserreducer from "./EmailSlice"
import studentReducer from "./StudentSlice"
import aluminiReducer from "./AluminiSlice"

const appStore=configureStore({
    reducer:{
        verifyuser:verifyuserreducer,
        studentdata:studentReducer,
        aluminidata:aluminiReducer,
    }
})

export default appStore