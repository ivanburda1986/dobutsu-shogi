import { configureStore } from "@reduxjs/toolkit";
import draggedStoneReducer from "./DraggedStoneSlice";
import lyingStoneReducer from "./LyingStoneSlice";

export default configureStore({
  reducer: {
    draggedStone: draggedStoneReducer,
    lyingStone: lyingStoneReducer,
  },
});
