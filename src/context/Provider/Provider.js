import React, { createContext, useReducer } from "react";
import CAT_INITIAL_STATE from "../categoryContext/CategoryContext";
import CURRENCY_INITIAL_STATE from "../currencyChangeContext/CurrencyContext";
import CurrencyReducer from "../currencyChangeContext/CurrencyReducer";
import CategoryReducer from "../categoryContext/CategoryReducer";
import CART_INITIAL_STATE from "../cartContext/CartContext";
import CartReducer from "../cartContext/CartReducer";
import QuantityReducer from "../quantityContext/QuantityReducer";
import QUANTITY_INITIAL_STATE from "../quantityContext/QuantityContext";
import ProductsReducer from "../productsContext/ProductReducer";
import PRODUCTS_INITIAL_STATE from "../productsContext/ProductContext";

export const GlobalContext = createContext({});

export function GlobalContextProvider({ children }) {
  const [categoryState, categoryDispatch] = useReducer(
    CategoryReducer,
    CAT_INITIAL_STATE
  );
  const [currencyState, currencyDispatch] = useReducer(
    CurrencyReducer,
    CURRENCY_INITIAL_STATE
  );
  const [cartState, cartDispatch] = useReducer(CartReducer, CART_INITIAL_STATE);
  const [quantityState, quantityDispatch] = useReducer(
    QuantityReducer,
    QUANTITY_INITIAL_STATE
  );
  const [productsState, productsDispatch] = useReducer(
    ProductsReducer,
    PRODUCTS_INITIAL_STATE
  );

  return (
    <GlobalContext.Provider
      value={{
        categoryState,
        categoryDispatch,
        currencyState,
        currencyDispatch,
        cartState,
        cartDispatch,
        quantityState,
        quantityDispatch,
        productsState,
        productsDispatch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

