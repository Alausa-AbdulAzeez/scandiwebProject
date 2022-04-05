import React, { Component } from 'react';
import Category from '../../components/category/Category';
import Navbar from '../../components/navbar/Navbar';
// import Cart from '../cart/Cart';
// import Product from '../product/Product';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Category />
      </div>
    );
  }
}

