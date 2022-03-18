import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    value: "ALL",
  },
  reducers: {
    tech: (state) => {
      state.value = "TECH";
    },
    clothes: (state) => {
      state.value = "CLOTHES";
    },
  },
});

// Action creators are generated for each case reducer function
export const { tech, clothes } = categorySlice.actions;

export default categorySlice.reducer;
