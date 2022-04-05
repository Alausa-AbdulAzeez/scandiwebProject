const CategoryReducer = (state, action) => {
  switch (action.type) {
    // CATEGORY REDUCER
    case "ALL_CAT":
      return {
        category: action.payload,
      };
    case "TECH_CAT":
      return {
        category: action.payload,
      };
    case "CLOTH_CAT":
      return {
        category: action.payload,
      };

    default:
      return { ...state };
  }
};

export default CategoryReducer;

