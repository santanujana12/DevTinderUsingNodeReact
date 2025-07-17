import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/userSlice";
import userConnectionSlice from "./slices/userConnectionSlice";

export const Store = configureStore({
    reducer:{
        user:UserSlice,
        userConnections:userConnectionSlice
    }
})