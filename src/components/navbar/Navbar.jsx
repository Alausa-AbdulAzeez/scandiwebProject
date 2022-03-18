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

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: 1,

      showMiniCart: false,
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
  handleQuantity = (type) => {
    if (type === "dec") {
      if (this.state.quantity > 1) {
        this.setState({ quantity: this.state.quantity - 1 });
      }
    }
    if (type === "inc") {
      this.setState({ quantity: this.state.quantity + 1 });
    }
  };

  handleClick = (e) => {
    if (e.target.innerText === "ALL") {
      this.removeActive();
      this.addActive(e);
      this.context.categoryDispatch(allCat());
    }
    if (e.target.innerText === "TECH") {
      this.removeActive();
      this.addActive(e);
      this.context.categoryDispatch(techCat());
    }
    if (e.target.innerText === "CLOTHES") {
      this.removeActive();
      this.addActive(e);
      this.context.categoryDispatch(clothCat());
    }
    // this.setState({ category: e.target.innerText });
  };

  showMiniCart = (e) => {
    console.log(e);
    this.setState({ showMiniCart: !this.state.showMiniCart });
  };

  render() {
    // console.log(this.context.category);
    const { currencyDispatch } = this.context;
    const { baseConverter, currency } = this.context.currencyState;
    // const ab = this.context.cartState;
    // console.log(ab);

    return (
      <>
        <div className="navbarContainer">
          <div className="navbar">
            <div className="navLeft">
              <ul>
                <li className="navLeftList active" onClick={this.handleClick}>
                  ALL
                </li>
                <li className="navLeftList" onClick={this.handleClick}>
                  TECH
                </li>
                <li className="navLeftList" onClick={this.handleClick}>
                  CLOTHES
                </li>
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
                <span className="cartIconBadge">3</span>
                <div className="miniCartWrapper">
                  <div className="cartOverlay">
                    <div className="miniCart">
                      <div className="miniCartTitle">
                        My Bag, <span>2 items</span>
                      </div>
                      <div className="miniCartContents">
                        <div className="miniCartContent">
                          <div className="contentLeft">
                            <div className="miniCartProductTitle">
                              Apollo running short
                            </div>
                            <div className="miniCartProductPrice">$10.00</div>
                            <div className="miniCartProductSizes">
                              <div className="miniCartProductSize">S</div>
                              <div className="miniCartProductSize">M</div>
                            </div>
                          </div>
                          <div className="contentRight">
                            <div className="quantitySet">
                              <div
                                className="miniCartAdd"
                                onClick={() => this.handleQuantity("inc")}
                              >
                                +
                              </div>
                              <div className="miniCartQuantity">
                                {this.state.quantity}
                              </div>
                              <div
                                className="miniCartRemove"
                                onClick={() => this.handleQuantity("dec")}
                              >
                                -
                              </div>
                            </div>
                            <div className="miniCartImg">
                              <img
                                src="https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div className="miniCartContent">
                          <div className="contentLeft">
                            <div className="miniCartProductTitle">
                              Apollo running short
                            </div>
                            <div className="miniCartProductPrice">$10.00</div>
                            <div className="miniCartProductSizes">
                              <div className="miniCartProductSize">S</div>
                              <div className="miniCartProductSize">M</div>
                            </div>
                          </div>
                          <div className="contentRight">
                            <div className="quantitySet">
                              <div className="miniCartAdd">+</div>
                              <div className="miniCartQuantity">1</div>
                              <div className="miniCartRemove">-</div>
                            </div>
                            <div className="miniCartImg">
                              <img
                                src="https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div className="miniCartContent">
                          <div className="contentLeft">
                            <div className="miniCartProductTitle">
                              Apollo running short
                            </div>
                            <div className="miniCartProductPrice">$10.00</div>
                            <div className="miniCartProductSizes">
                              <div className="miniCartProductSize">S</div>
                              <div className="miniCartProductSize">M</div>
                            </div>
                          </div>
                          <div className="contentRight">
                            <div className="quantitySet">
                              <div className="miniCartAdd">+</div>
                              <div className="miniCartQuantity">1</div>
                              <div className="miniCartRemove">-</div>
                            </div>
                            <div className="miniCartImg">
                              <img
                                src="https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div className="miniCartContent">
                          <div className="contentLeft">
                            <div className="miniCartProductTitle">
                              Apollo running short
                            </div>
                            <div className="miniCartProductPrice">$10.00</div>
                            <div className="miniCartProductSizes">
                              <div className="miniCartProductSize">S</div>
                              <div className="miniCartProductSize">M</div>
                            </div>
                          </div>
                          <div className="contentRight">
                            <div className="quantitySet">
                              <div className="miniCartAdd">+</div>
                              <div className="miniCartQuantity">1</div>
                              <div className="miniCartRemove">-</div>
                            </div>
                            <div className="miniCartImg">
                              <img
                                src="https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div className="miniCartContent">
                          <div className="contentLeft">
                            <div className="miniCartProductTitle">
                              Apollo running short
                            </div>
                            <div className="miniCartProductPrice">$10.00</div>
                            <div className="miniCartProductSizes">
                              <div className="miniCartProductSize">S</div>
                              <div className="miniCartProductSize">M</div>
                            </div>
                          </div>
                          <div className="contentRight">
                            <div className="quantitySet">
                              <div className="miniCartAdd">+</div>
                              <div className="miniCartQuantity">1</div>
                              <div className="miniCartRemove">-</div>
                            </div>
                            <div className="miniCartImg">
                              <img
                                src="https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div className="miniCartContent">
                          <div className="contentLeft">
                            <div className="miniCartProductTitle">
                              Apollo running short
                            </div>
                            <div className="miniCartProductPrice">$10.00</div>
                            <div className="miniCartProductSizes">
                              <div className="miniCartProductSize">S</div>
                              <div className="miniCartProductSize">M</div>
                            </div>
                          </div>
                          <div className="contentRight">
                            <div className="quantitySet">
                              <div className="miniCartAdd">+</div>
                              <div className="miniCartQuantity">1</div>
                              <div className="miniCartRemove">-</div>
                            </div>
                            <div className="miniCartImg">
                              <img
                                src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-pro-family-hero?wid=940&amp;hei=1112&amp;fmt=jpeg&amp;qlt=80&amp;.v=1604021663000"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="miniCartFooter">
                        <div className="miniCartTotal">
                          <div className="totalText">Total</div>
                          <div className="totalDigit">$100</div>
                        </div>
                        <div className="miniCartButtons">
                          <div className="viewBag">VIEW BAG</div>
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
