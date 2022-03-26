import React, { Component } from "react";
import Navbar from "../../components/navbar/Navbar";
import {
  addProduct,
  removeProduct,
} from "../../context/cartContext/CartActions";
import { GlobalContext } from "../../context/Provider/Provider";
import "./cart.css";

export default class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: null,
      productInCart: null,
      selectedProduct: this.product,
      prodWatt: null,
      id: window.location.href.split("/")[3],
      disabled: true,
      arr: [],
      varArr: [],
      att: [],
      quantity: 1,
      attArr: [],
      disabledRemove: false,
      variationBtnDisabled: true,
    };
  }

  static contextType = GlobalContext;

  ProdhandleQuantity = (singleProduct, type, ab) => {
    if (type === "dec") {
      if (ab > 0) {
        this.context.cartDispatch(
          removeProduct({
            product: singleProduct,
            price: singleProduct.prices[0].amount,
            quantity: 1,
          })
        );
        this.setState({ disabledRemove: true });
        setTimeout(() => {
          this.setState({ disabledRemove: false });
        }, 500);
      }
    }
    if (type === "inc") {
      if (singleProduct.attributes.length === 0) {
        this.context.cartDispatch(
          addProduct({
            product: singleProduct,
            price: singleProduct.prices[0].amount,
            quantity: 1,
          })
        );
      } else {
        this.context.cartDispatch(
          addProduct({
            product: singleProduct,
            price: singleProduct.prices[0].amount,
            quantity: 1,
          })
        );
      }
    }
  };

  render() {
    const { currency, baseConverter } = this.context.currencyState;
    const { quantity, cart } = this.context.cartState;
    const dispContentSet = new Set(cart);
    const dispContent = Array.from(dispContentSet);
    console.log(dispContent);

    return (
      <div>
        <Navbar />
        <div className="cartText">Cart</div>
        {dispContent && dispContent.length > 0 ? (
          dispContent.map((cartItem) => {
            return (
              <div
                className="cartItem"
                key={
                  new Date().valueOf().toString(36) +
                  Math.random().toString(36).substr(2)
                }
              >
                <div className="mainCartContent">
                  <div className="cartContentLeft">
                    <div className="cartPproductTitle">
                      {cartItem.name.split(" ").slice(0, 1)}
                      <br />
                      <span>{cartItem.name.split(" ").slice(1).join(" ")}</span>
                    </div>
                    <div className="mainCartProductPrice">
                      {currency}
                      {(cartItem.prices[0].amount * baseConverter).toFixed(2)}
                    </div>
                    <div className="mainCartProductSizes">
                      {cartItem.attributes.length > 0 &&
                        cartItem.attributes.map((attribute) => {
                          if (Object.keys(attribute)[0] === "color") {
                            return (
                              <div
                                className=" selecTedColorWrapper"
                                key={
                                  new Date().valueOf().toString(36) +
                                  Math.random().toString(36).substr(2)
                                }
                              >
                                <div
                                  className="miniProductDisplayColor"
                                  style={{
                                    backgroundColor: `${Object.values(
                                      attribute
                                    )}`,
                                  }}
                                  key={
                                    new Date().valueOf().toString(36) +
                                    Math.random().toString(36).substr(2)
                                  }
                                ></div>
                              </div>
                            );
                          } else {
                            return (
                              <div
                                className="attributesWrapper"
                                key={
                                  new Date().valueOf().toString(36) +
                                  Math.random().toString(36).substr(2)
                                }
                              >
                                <p className="attributeTitle">
                                  {Object.keys(attribute)}
                                </p>

                                <div className="miniCartProductSize">
                                  {Object.values(attribute)}
                                </div>
                              </div>
                            );
                          }
                        })}
                    </div>
                  </div>
                  <div className="contentRight">
                    <div className="quantitySet">
                      <button
                        disabled={this.state.disabledRemove}
                        className="variationRemove"
                        onClick={() =>
                          this.ProdhandleQuantity(
                            cartItem,
                            "inc",

                            cart.filter((v) => v === cartItem).length
                          )
                        }
                      >
                        +
                      </button>
                      <div className="variationQuantity">
                        {cart.filter((v) => v === cartItem).length}
                      </div>
                      <button
                        disabled={this.state.disabledRemove}
                        className="variationRemove"
                        onClick={() =>
                          this.ProdhandleQuantity(
                            cartItem,
                            "dec",

                            cart.filter((v) => v === cartItem).length
                          )
                        }
                      >
                        -
                      </button>
                    </div>
                    <div className="mainCartImg">
                      <img src={cartItem.gallery[0]} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="cartItem">Cart is empty</div>
        )}
      </div>
    );
  }
}
