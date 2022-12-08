import { createSlice } from "@reduxjs/toolkit";

export const lyingStoneSlice = createSlice({
  name: "lyingStone",
  initialState: {
    lyingStone: {},
  },
  reducers: {
    saveLyingStone: (state, action) => void (state.lyingStone = action.payload),
  },
});

export const { saveLyingStone } = lyingStoneSlice.actions;

export const selectLyingStone = (state: { lyingStone: any }) =>
  state.lyingStone;

export default lyingStoneSlice.reducer;
