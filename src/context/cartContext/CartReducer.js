const CartReducer = (state, action) => {
  switch (action.type) {
    // CArt REDUCER
    case "ADD_PRODUCT":
      return {
        cart: [...state.cart, action.payload.product],
        quantity: state.quantity + 1,
        total: state.total + action.payload.price * action.payload.quantity,
      };
    case "REMOVE_PRODUCT":
      return {
        cart: state.cart.push(action.payload),
        quantity: state.quantity - 1,
        total: state.total - action.payload.price * action.payload.quantity,
      };

    default:
      return { ...state };
  }
};

export default CartReducer;
