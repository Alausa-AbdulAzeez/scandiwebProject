import React, { Component } from "react";
import SimpleImageSlider from "react-simple-image-slider";
import Navbar from "../../components/navbar/Navbar";
import {
  addProduct,
  removeProduct,
} from "../../context/cartContext/CartActions";
import { GlobalContext } from "../../context/Provider/Provider";
import "./cart.css";
// import a from "../../icons/";

<link rel="stylesheet" href="carousel.css" />;

export default class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: null,
      disabledRemove: false,
      clickedProduct: null,
      i: 0,
      carClick: null,
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
        this.setState({ clickedProduct: singleProduct });
        this.context.cartDispatch(
          addProduct({
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
  };
  handleImgSlide = (e, direction, cartItem) => {
    this.setState({ carClick: cartItem });
    console.log(cartItem);
    let id = cartItem.idInCart;

    const currentImg = document.getElementById(`${id}`);
    // currentImg.style.transform = "translateX(-141px)";

    console.log(currentImg);

    if (direction === "right") {
      console.log(this.state.i);
      console.log(cartItem.gallery.length);
      if (this.state.i + 1 === cartItem.gallery.length) {
        console.log("jd");
        this.setState({ i: 0 });
      } else {
        this.setState({ i: this.state.i + 1 });
      }
    } else {
      console.log("hey");
      if (this.state.i > 0) {
        this.setState({ i: this.state.i - 1 });
      } else {
        this.setState({ i: cartItem.gallery.length - 1 });
      }
    }
  };

  render() {
    const { currency, baseConverter } = this.context.currencyState;
    const { quantity, cart } = this.context.cartState;
    const dispContentSet = new Set(cart);
    const dispContent = Array.from(dispContentSet);

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
                    {/* <div className="quantitySet">
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
                    </div> */}
                    <div className="quantitySet">
                      {this.state.clickedProduct === cartItem ? (
                        <button
                          disabled={this.state.disabledRemove}
                          className="variationAdd"
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
                      ) : (
                        <button
                          className="variationAdd"
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
                      )}

                      <div className="variationQuantity">
                        {this.state.disabledRemove ? (
                          this.state.clickedProduct === cartItem ? (
                            <div className="loader"></div>
                          ) : (
                            cart.filter((v) => v === cartItem).length
                          )
                        ) : (
                          cart.filter((v) => v === cartItem).length
                        )}
                      </div>
                      {this.state.clickedProduct === cartItem ? (
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
                      ) : (
                        <button
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
                      )}
                    </div>
                    <div className="mainCartImg">
                      {cartItem.gallery.length === 1 ? (
                        <img
                          src={cartItem.gallery[0]}
                          alt=""
                          // key={singleImage}
                          className="currentImg"
                        />
                      ) : (
                        <>
                          <img
                            src={require("../../icons/chevron-right.png")}
                            alt=""
                            className="chevRight"
                            onClick={(e) =>
                              this.handleImgSlide(e, "right", cartItem)
                            }
                          />
                          <div
                            className="cartImgContainer"
                            id={cartItem.idInCart}
                          >
                            {this.state.carClick === cartItem ? (
                              <img
                                src={cartItem.gallery[this.state.i]}
                                alt=""
                                // key={singleImage}
                                className="currentImg"
                              />
                            ) : (
                              <img
                                src={cartItem.gallery[0]}
                                alt=""
                                // key={singleImage}
                                className="currentImg"
                              />
                            )}

                            {/* {cartItem &&
                          cartItem.gallery.map((singleImage) => {
                            return (
                              <div className="slide">
                                <img
                                  src={singleImage}
                                  alt=""
                                  key={singleImage}
                                  className="currentImg"
                                />
                              </div>
                            );
                          })} */}
                          </div>
                          <img
                            src={require("../../icons/chevron-left.png")}
                            alt=""
                            className="chevLeft"
                            onClick={(e) =>
                              this.handleImgSlide(e, "left", cartItem)
                            }
                          />
                        </>
                      )}

                      {/* <SimpleImageSlider
                          width={200}
                          height={200}
                          images={cartItem.gallery}
                          showBullets={true}
                          showNavs={true}
                          autoPlay={true}
                          navStyle={{
                            objectFit: "contain",
                            cursor: "progress",
                          }}
                        /> */}
                      {/* <img src={cartItem.gallery[0]} alt="" /> */}
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

