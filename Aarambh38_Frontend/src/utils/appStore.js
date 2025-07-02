import {configureStore} from "@reduxjs/toolkit"
import verifyuserreducer from "./EmailSlice"

const appStore=configureStore({
    reducer:{
        verifyuser:verifyuserreducer,
    }
})

export default appStore