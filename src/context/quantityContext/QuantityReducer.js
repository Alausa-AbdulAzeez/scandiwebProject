const QuantityReducer = (state, action) => {
  switch (action.type) {
    // Quantity REDUCER
    case "INCREASE_QUANTITY":
      return {
        ProductQuantity: state.ProductQuantity + 1,
      };
    case "REDUCE_QUANTITY":
      return {
        ProductQuantity: state.ProductQuantity - 1,
      };

    default:
      return { ...state };
  }
};

export default QuantityReducer;
