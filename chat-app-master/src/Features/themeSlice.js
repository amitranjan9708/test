import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: 'themeSlice',
  initialState: true,
  reducers: {
    toggleTheme: (state) => {
      // Mutate the state directly to toggle its value
      return !state;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
