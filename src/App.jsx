import React, { Component } from "react";
import Home from "./pages/home/Home";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import { ApolloProvider } from "@apollo/client";
import Product from "./pages/product/Product";
import Cart from "./pages/cart/Cart";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const client = new ApolloClient({
  uri: "http://localhost:4000/",
});

// };

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/clothes" element={<Home />} /> */}
            {/* <Route path="/tech" element={<Home />} /> */}
            {/* <Route path="/:cat" element={<Home />} /> */}
            <Route path="/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}
