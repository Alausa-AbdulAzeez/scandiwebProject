import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../redux/categorySlice";

export default configureStore({
  reducer: {
    category: categoryReducer,
  },
});
