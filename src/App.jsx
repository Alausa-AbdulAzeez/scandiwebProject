import React, { Component } from "react";
import ApolloClient from "apollo-boost";
// import { gql } from 'apollo-boost';
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cart from "./pages/cart/Cart";
import Product from "./pages/product/Product";
import Home from "./pages/home/Home";

export const client = new ApolloClient({
  uri: "http://localhost:4000/",
});

// };

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

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
export default App;

