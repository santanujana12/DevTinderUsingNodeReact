import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/userSlice";
import suggestedUserSlice from "./slices/suggestedUserSlice";

export const Store = configureStore({
    reducer:{
        user:UserSlice,
        suggestedUsers:suggestedUserSlice
    }
})