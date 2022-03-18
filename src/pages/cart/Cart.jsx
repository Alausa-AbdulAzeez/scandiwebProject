import React, { Component } from "react";
import Navbar from "../../components/navbar/Navbar";
import { GlobalContext } from "../../context/Provider/Provider";
import "./cart.css";

export default class Cart extends Component {
  static contextType = GlobalContext;
  render() {
    const { currency, baseConverter } = this.context.currencyState;
    console.log(currency, baseConverter);
    console.log(this.context);
    return (
      <div>
        <Navbar />
        <div className="cartText">Cart</div>
        <div className="cartItem">
          <div className="mainCartContent">
            <div className="cartContentLeft">
              <div className="cartPproductTitle">
                Apollo <br /> <span>running short</span>
              </div>
              <div className="mainCartProductPrice">
                {currency}
                {(10.0 * baseConverter).toFixed(2)}
              </div>
              <div className="mainCartProductSizes">
                <div className="mainCartProductSize">S</div>
                <div className="mainCartProductSize">M</div>
              </div>
            </div>
            <div className="contentRight">
              <div className="quantitySet">
                <div className="mainCartAdd">+</div>
                <div className="mainCartQuantity">1</div>
                <div className="mainCartRemove">-</div>
              </div>
              <div className="mainCartImg">
                <img
                  src="https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="cartItem">sjsk</div>
      </div>
    );
  }
}
