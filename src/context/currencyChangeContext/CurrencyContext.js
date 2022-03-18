// import { createContext, useReducer } from "react";
// import CategoryReducer from "./CategoryReducer";

export const CURRENCY_INITIAL_STATE = {
  category: "ALL",
  currency: "$",
  baseConverter: Number("1"),
};

// export const CategoryContext = createContext(CAT_INITIAL_STATE);

// export const CategoryContextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(CategoryReducer, CAT_INITIAL_STATE);

//   return (
//     <CategoryContext.Provider
//       value={{
//         category: state.category,
//         currency: state.currency,
//         baseConverter: state.baseConverter,
//         dispatch,
//       }}
//     >
//       {children}
//     </CategoryContext.Provider>
//   );
// };
