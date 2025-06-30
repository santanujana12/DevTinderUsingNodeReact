import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/userSlice"

export const Store = configureStore({
    reducer:{
        user:UserSlice
    }
})