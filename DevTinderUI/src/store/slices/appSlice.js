import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    loading: false,
  },
  reducers: {
    set_loading: (state, action) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
});

export const { set_loading } = appSlice.actions;
export default appSlice.reducer;
