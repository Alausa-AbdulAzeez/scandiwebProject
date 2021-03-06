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
      if (action.payload.product.attributes.length === 0) {
        return {
          cart: state.cart.slice(1),
          quantity: state.quantity - 1,
          total: state.total - action.payload.price * action.payload.quantity,
        };
      }
      state.cart.splice(
        state.cart.findIndex(
          (cartitem) => cartitem.idInCart === action.payload.product.idInCart
        ),
        1
      );

      return {
        cart: state.cart,
        quantity: state.quantity - 1,
        total: state.total - action.payload.price * action.payload.quantity,
      };

    default:
      return { ...state };
  }
};

export default CartReducer;

