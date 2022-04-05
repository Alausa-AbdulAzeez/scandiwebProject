const ProductsReducer = (state, action) => {
  switch (action.type) {
    // Products REDUCER
    case "GET_PRODUCTS":
      return {
        products: action.payload.products,
      };

    default:
      return { ...state };
  }
};

export default ProductsReducer;

