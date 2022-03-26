let a = JSON.parse(localStorage.getItem("cart"));
let b = a;

export const CART_INITIAL_STATE = {
  cart: [],
  quantity: 0,
  total: 0,
};
