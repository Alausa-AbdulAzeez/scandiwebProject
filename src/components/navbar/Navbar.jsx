import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faCartShopping,
  faRefresh,
  faShoppingBasket,
} from "@fortawesome/free-solid-svg-icons";

import "./navbar.css";
import Category from "../category/Category";
import { CategoryContext } from "../../context/categoryContext/CategoryContext";
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
import {
  decreaseProductAmount,
  increaseProductAmount,
} from "../../context/quantityContext/QuantityActions";

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

      showMiniCart: false,
      category: null,
    };
  }
  static contextType = GlobalContext;

  removeActive = () => {
    const activeList = document.querySelectorAll(".active");
    activeList.forEach((item) => item.classList.remove("active"));
  };

  addActive = (e) => {
    e.target.classList.add("active");
  };
  handleQuantity = (singleProduct, type, ProductQuantity) => {
    if (type === "dec") {
      if (ProductQuantity > 0) {
        // this.context.quantityDispatch(decreaseProductAmount());
        this.context.cartDispatch(
          removeProduct({
            product: singleProduct,
            price: singleProduct.prices[0].amount,
            quantity: 1,
          })
        );
      }
    }
    if (type === "inc") {
      // this.setState({ quantity: this.state.quantity + 1 });
      this.context.quantityDispatch(increaseProductAmount());
      // console.log(ProductQuantity);
      this.context.cartDispatch(
        addProduct({
          product: singleProduct,
          price: singleProduct.prices[0].amount,
          quantity: 1,
        })
      );
    }
  };

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
    const { category } = this.context.categoryState;
    const { quantity, cart, total } = this.context.cartState;
    const { ProductQuantity } = this.context.quantityState;
    const dispContentSet = new Set(cart);
    const dispContent = Array.from(dispContentSet);
    // let dispContent = cart.filter(
    //   (v, i, a) => a.findIndex((v2) => v2.attributes === v.attributes) === i
    // );
    // console.log(dispContent);

    // console.log(cart);
    // console.log(dispContent.size);
    // localStorage.removeItem("cart");

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
                                  <div className="quantitySet">
                                    <div
                                      className="miniCartAdd"
                                      onClick={() =>
                                        this.handleQuantity(
                                          singleProduct,
                                          "inc",
                                          ProductQuantity
                                        )
                                      }
                                    >
                                      +
                                    </div>
                                    <div className="miniCartQuantity">
                                      {
                                        cart.filter((v) => v === singleProduct)
                                          .length
                                      }
                                    </div>
                                    <div
                                      className="miniCartRemove"
                                      onClick={() =>
                                        this.handleQuantity(
                                          singleProduct,
                                          "dec",
                                          ProductQuantity
                                        )
                                      }
                                    >
                                      -
                                    </div>
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
