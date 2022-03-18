// import { createContext, useReducer } from "react";
// import CategoryReducer from "./CategoryReducer";

export const CAT_INITIAL_STATE = {
  category: "ALL",
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
// import React, { Component } from "react";

// export const CategoryContext = React.createContext();

// export class CategoryContextProvider extends Component {
//   // Context state
//   state = {
//     category: "ALL",
//   };

//   // Method to update state
//   setCategory = (category) => {
//     this.setState((prevState) => ({ category }));
//   };

//   render() {
//     const { children } = this.props;
//     // const { category } = this.state;
//     const { setCategory } = this;

//     return (
//       <CategoryContext.Provider
//         value={{
//           category: this.state.category,
//           setCategory,
//         }}
//       >
//         {children}
//       </CategoryContext.Provider>
//     );
//   }
// }
