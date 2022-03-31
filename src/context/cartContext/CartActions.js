export const addProduct = ({ product, price, quantity }) => ({
  type: 'ADD_PRODUCT',
  // payload: { product },
  payload: { product, price, quantity },
});
export const removeProduct = ({ product, price, quantity }) => ({
  type: 'REMOVE_PRODUCT',
  payload: { product, price, quantity },
});

