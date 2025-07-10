import { createSlice } from "@reduxjs/toolkit";

const SuggestedUserSlice = createSlice({
  name: "suggestedUsers",
  initialState: [],
  reducers: {
    addSuggestedUsers: (state, action) => {
      return action.payload;
    },
    removeSuggestedUsers: (state, action) => {
      return [];
    },
  },
});

export const { addSuggestedUsers } = SuggestedUserSlice.actions;
export default SuggestedUserSlice.reducer;
