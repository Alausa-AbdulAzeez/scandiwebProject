const CategoryReducer = (state, action) => {
  switch (action.type) {
    // CATEGORY REDUCER
    case "ALL_CAT":
      return {
        category: "ALL",
      };
    case "TECH_CAT":
      return {
        category: "TECH",
      };
    case "CLOTH_CAT":
      return {
        category: "CLOTHES",
      };

    default:
      return { ...state };
  }
};

export default CategoryReducer;
