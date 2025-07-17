import { createSlice } from "@reduxjs/toolkit";

const UserConnectionSlice = createSlice({
  name: "userConnections",
  initialState: null,
  reducers: {
    setUserConnections: (state, action) => {
      return action.payload;
    },
    removeUserConnections: () => {
      return [];
    },
  },
});

export const { setUserConnections, removeUserConnections } =
  UserConnectionSlice.actions;
export default UserConnectionSlice.reducer;
