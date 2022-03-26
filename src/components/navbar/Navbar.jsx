import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faCartShopping,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

import "./navbar.css";

import {
  allCat,
  clothCat,
  techCat,
} from "../../context/categoryContext/CategoryActions";
import { GlobalContext } from "../../context/Provider/Provider";
import {
  toCad,
  toGbp,
  toJpy,
  toRub,
  toUsd,
} from "../../context/currencyChangeContext/CurrencyActions";
import { Link } from "react-router-dom";
import {
  addProduct,
  removeProduct,
} from "../../context/cartContext/CartActions";
import { increaseProductAmount } from "../../context/quantityContext/QuantityActions";

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: 1,
      activeList: {
        allActive: "",
        techActive: "",
        clothActive: "",
      },
      clickedProduct: null,
      disabledRemove: false,

      showMiniCart: false,
      category: null,
    };
  }
  static contextType = GlobalContext;

  // Remove styling from links
  removeActive = () => {
    const activeList = document.querySelectorAll(".active");
    activeList.forEach((item) => item.classList.remove("active"));
  };

  // Add styling to links
  addActive = (e) => {
    e.target.classList.add("active");
  };

  // Modify product quantity

  handleQuantity = (singleProduct, type, ProductQuantity) => {
    //  Decrease quantity
    if (type === "dec") {
      if (ProductQuantity > 0) {
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
    //  Increase quantity
    if (type === "inc") {
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
  };

  // Set current link
  handleClick = (e) => {
    if (e.target.innerText === "ALL") {
      this.setState({
        activeList: {
          allActive: "active",
          techActive: "",
          clothActive: "",
        },
      });

      this.context.categoryDispatch(allCat("ALL"));
    }
    if (e.target.innerText === "TECH") {
      this.setState({
        activeList: {
          allActive: "",
          techActive: "active",
          clothActive: "",
        },
      });

      this.context.categoryDispatch(techCat("TECH"));
    }
    if (e.target.innerText === "CLOTHES") {
      this.setState({
        activeList: {
          allActive: "",
          techActive: "",
          clothActive: "active",
        },
      });

      this.context.categoryDispatch(clothCat("CLOTHES"));
    }
  };

  // Show miniCart
  showMiniCart = (e) => {
    this.setState({ showMiniCart: !this.state.showMiniCart });
  };

  componentDidMount() {
    let category = this.context.categoryState.category;
    if (category === "ALL") {
      this.setState({
        activeList: {
          allActive: "active",
          techActive: "",
          clothActive: "",
        },
      });
    }
    if (category === "TECH") {
      this.setState({
        activeList: {
          allActive: "",
          techActive: "active",
          clothActive: "",
        },
      });
    }
    if (category === "CLOTHES") {
      this.setState({
        activeList: {
          allActive: "",
          techActive: "",
          clothActive: "active",
        },
      });
    }
  }

  render() {
    const { currencyDispatch } = this.context;
    const { baseConverter, currency } = this.context.currencyState;
    const { cart, total } = this.context.cartState;
    const { ProductQuantity } = this.context.quantityState;
    const dispContentSet = new Set(cart);
    const dispContent = Array.from(dispContentSet);

    return (
      <>
        <div className="navbarContainer">
          <div className="navbar">
            <div className="navLeft">
              <ul>
                <Link to={`/`}>
                  <li
                    className={`navLeftList ${
                      this.state.activeList.allActive === "active" && "active"
                    }`}
                    onClick={this.handleClick}
                  >
                    ALL
                  </li>
                </Link>
                <Link to={"/"}>
                  <li
                    className={`navLeftList ${
                      this.state.activeList.techActive === "active" && "active"
                    }`}
                    onClick={this.handleClick}
                  >
                    TECH
                  </li>
                </Link>
                <Link to={"/"}>
                  <li
                    className={`navLeftList ${
                      this.state.activeList.clothActive === "active" && "active"
                    }`}
                    onClick={this.handleClick}
                  >
                    CLOTHES
                  </li>
                </Link>
              </ul>
            </div>
            <div className="navCenter">
              <FontAwesomeIcon icon={faRefresh} className="bagIcon" />
            </div>
            <div className="navRightWrapper">
              <div className="navRight">
                <div className="currencySymbol">{currency}</div>
                <FontAwesomeIcon icon={faAngleDown} className="angleIcon" />
                <div className="navRightList">
                  <li
                    className="currencyList"
                    onClick={() => {
                      currencyDispatch(toUsd());
                    }}
                  >
                    USD $
                  </li>
                  <li
                    className="currencyList"
                    onClick={() => {
                      currencyDispatch(toGbp());
                    }}
                  >
                    GBP £
                  </li>

                  <li
                    className="currencyList"
                    onClick={() => {
                      currencyDispatch(toCad());
                    }}
                  >
                    CAD A$
                  </li>
                  <li
                    className="currencyList"
                    onClick={() => {
                      currencyDispatch(toJpy());
                    }}
                  >
                    JPY ¥
                  </li>
                  <li
                    className="currencyList"
                    onClick={() => {
                      currencyDispatch(toRub());
                    }}
                  >
                    RUB ₽
                  </li>
                </div>
              </div>
              <div
                className="cartIconContainer"
                showminicart={this.state.showMiniCart.toString()}
              >
                <FontAwesomeIcon
                  icon={faCartShopping}
                  className="cartIcon"
                  onClick={this.showMiniCart}
                />
                <span className="cartIconBadge">{cart.length}</span>
                <div className="miniCartWrapper">
                  <div className="cartOverlay">
                    <div className="miniCart">
                      <div className="miniCartTitle">
                        My Bag, <span>{cart.length} item(s)</span>
                      </div>
                      <div className="miniCartContents">
                        {dispContent.length > 0 ? (
                          dispContent.map((singleProduct) => {
                            return (
                              <div
                                className="miniCartContent"
                                key={
                                  new Date().valueOf().toString(36) +
                                  Math.random().toString(36).substr(2)
                                }
                              >
                                <div className="contentLeft">
                                  {singleProduct.name.split(" ").slice(0, 1)}
                                  <br />
                                  <span>
                                    {singleProduct.name
                                      .split(" ")
                                      .slice(1)
                                      .join(" ")}
                                  </span>
                                  <div className="miniCartProductPrice">
                                    {currency}
                                    {(
                                      singleProduct.prices[0].amount *
                                      baseConverter
                                    ).toFixed(2)}
                                  </div>
                                  <div className="miniCartProductSizes">
                                    {singleProduct.attributes.length > 0 &&
                                      singleProduct.attributes.map(
                                        (attribute) => {
                                          if (
                                            Object.keys(attribute)[0] ===
                                            "color"
                                          ) {
                                            return (
                                              <div
                                                className=" selecTedColorWrapper"
                                                key={
                                                  new Date()
                                                    .valueOf()
                                                    .toString(36) +
                                                  Math.random()
                                                    .toString(36)
                                                    .substr(2)
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
                                                    new Date()
                                                      .valueOf()
                                                      .toString(36) +
                                                    Math.random()
                                                      .toString(36)
                                                      .substr(2)
                                                  }
                                                ></div>
                                              </div>
                                            );
                                          } else {
                                            return (
                                              <div
                                                className="attributesWrapper"
                                                key={
                                                  new Date()
                                                    .valueOf()
                                                    .toString(36) +
                                                  Math.random()
                                                    .toString(36)
                                                    .substr(2)
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
                                        }
                                      )}
                                  </div>
                                </div>
                                <div className="contentRight">
                                  <div className="variationSet">
                                    {this.state.clickedProduct ===
                                    singleProduct ? (
                                      <button
                                        disabled={this.state.disabledRemove}
                                        className="variationAdd"
                                        onClick={() =>
                                          this.handleQuantity(
                                            singleProduct,
                                            "inc",
                                            ProductQuantity,

                                            cart.filter(
                                              (v) => v === singleProduct
                                            ).length
                                          )
                                        }
                                      >
                                        +
                                      </button>
                                    ) : (
                                      <button
                                        className="variationAdd"
                                        onClick={() =>
                                          this.handleQuantity(
                                            singleProduct,
                                            "inc",
                                            ProductQuantity,

                                            cart.filter(
                                              (v) => v === singleProduct
                                            ).length
                                          )
                                        }
                                      >
                                        +
                                      </button>
                                    )}

                                    <div className="variationQuantity">
                                      {this.state.disabledRemove ? (
                                        this.state.clickedProduct ===
                                        singleProduct ? (
                                          <div className="loader">
                                            {console.log(singleProduct)}
                                          </div>
                                        ) : (
                                          cart.filter(
                                            (v) => v === singleProduct
                                          ).length
                                        )
                                      ) : (
                                        cart.filter((v) => v === singleProduct)
                                          .length
                                      )}
                                    </div>
                                    {this.state.clickedProduct ===
                                    singleProduct ? (
                                      <button
                                        disabled={this.state.disabledRemove}
                                        className="variationRemove"
                                        onClick={() =>
                                          this.handleQuantity(
                                            singleProduct,
                                            "dec",
                                            ProductQuantity,

                                            cart.filter(
                                              (v) => v === singleProduct
                                            ).length
                                          )
                                        }
                                      >
                                        -
                                      </button>
                                    ) : (
                                      <button
                                        className="variationRemove"
                                        onClick={() =>
                                          this.handleQuantity(
                                            singleProduct,
                                            "dec",
                                            ProductQuantity,

                                            cart.filter(
                                              (v) => v === singleProduct
                                            ).length
                                          )
                                        }
                                      >
                                        -
                                      </button>
                                    )}
                                  </div>
                                  <div className="miniCartImg">
                                    <img
                                      src={singleProduct.gallery[0]}
                                      alt=""
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="miniCartTotal">ABC</div>
                        )}
                      </div>
                      <div className="miniCartFooter">
                        <div className="miniCartTotal">
                          <div className="totalText">Total</div>
                          <div className="totalDigit">
                            {currency}
                            {(total * baseConverter).toFixed(2)}
                          </div>
                        </div>
                        <div className="miniCartButtons">
                          <Link to={"/cart"} className="viewBag">
                            <div>VIEW BAG</div>
                          </Link>
                          <div className="checkOut">CHECKOUT</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
