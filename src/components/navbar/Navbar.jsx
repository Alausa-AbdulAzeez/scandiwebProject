import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faCartShopping,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

import "./navbar.css";

import { Link } from "react-router-dom";
import {
  allCat,
  clothCat,
  techCat,
} from "../../context/categoryContext/CategoryActions";
import { GlobalContext } from "../../context/Provider/Provider";
import {
  toAUD,
  toGBP,
  toJPY,
  toRUB,
  toUSD,
} from "../../context/currencyChangeContext/CurrencyActions";
import {
  addProduct,
  removeProduct,
} from "../../context/cartContext/CartActions";
import { client } from "../../App";
import { gql } from "apollo-boost";
import { getProducts } from "../../context/productsContext/ProductActions";

export default class Navbar extends Component {
  static contextType = GlobalContext;

  constructor(props) {
    super(props);

    this.state = {
      clickedProduct: null,
      disabledRemove: false,
      showScroll: true,
      showMiniCart: false,
      categories: null,

      currencies: null,
      currentCategorySet: "all",
    };
  }

  getCategory = (result) => {
    this.setState({ categories: result.data.categories });
  };
  getCurrencies = (result) => {
    this.setState({ currencies: result.data.currencies });
  };

  componentDidMount() {
    this.get_categories();
    this.get_currencies();
    this.get_products();
    console.log(this.context.categoryState.category.toLowerCase());
  }

  getProductsAndCategory = (result) => {
    console.log(this.context.categoryState.category);
    const { productsDispatch } = this.context;
    productsDispatch(getProducts({ products: result.data.category.products }));
    // this.setState({
    //   currentCategorySet: this.context.categoryState.category.toLowerCase(),
    // });
  };

  get_products = async () => {
    client
      .query({
        query: gql`
          query getCategory {
            category(input: { title: "${this.context.categoryState.category.toLowerCase()}" }) {
              name
              products {
                id
                name
                inStock
                gallery
                description
                category
                attributes {
                  id
                  name
                  type
                  items {
                    displayValue
                    value
                    id
                  }
                }
                prices {
                  currency {
                    symbol
                  }
                  amount
                }
                brand
              }
            }
          }
        `,
      })
      .then((result) => {
        this.context.productsDispatch(
          getProducts({ products: result.data.category.products })
        );
        // localStorage.setItem("cat", this.context.categoryState.category);
        // this.setState({
        //   currentCategorySet: this.context.categoryState.category,
        // });
      });
  };

  get_categories = async () => {
    client
      .query({
        query: gql`
          query getCategory {
            categories {
              name
            }
          }
        `,
      })
      .then((result) => this.getCategory(result));
  };

  get_currencies = async () => {
    client
      .query({
        query: gql`
          query getCurrencies {
            currencies {
              label
              symbol
            }
          }
        `,
      })
      .then((result) => this.getCurrencies(result));
  };

  // Set current link

  handleClick = async (e, showOverflow) => {
    const { showMiniCart } = this.state;
    const { categoryDispatch, categoryState } = this.context;

    if (showMiniCart) {
      this.setViewCart(showOverflow);
    }

    switch (e.target.innerText) {
      case "ALL":
        await categoryDispatch(allCat("ALL"));

        this.get_products();
        break;
      case "TECH":
        await categoryDispatch(techCat("TECH"));
        this.get_products();
        break;
      case "CLOTHES":
        await categoryDispatch(clothCat("CLOTHES"));
        this.get_products();
        break;

      default:
        categoryDispatch(allCat("ALL"));
        break;
    }

    // this.setState({
    //   currentCategorySet: this.context.categoryState.category,
    // });
  };

  // Show miniCart
  showMiniCart = (showOverflow) => {
    const { setScroll } = this;
    const { showMiniCart } = this.state;
    setScroll(showOverflow);
    this.setState({ showMiniCart: !showMiniCart });
  };

  // closeOverlay = () => {
  //   if (this.state.showMiniCart) {
  //     this.setState({ showMiniCart: !this.state.showMiniCart });
  //   }
  // };

  setScroll = (showOverflow) => {
    if (showOverflow === false) {
      document.body.style.overflow = "scroll";
    } else {
      document.body.style.overflow = "hidden";
    }
    this.setState((prevState) => ({ showScroll: !prevState }));
  };

  handleQuantity = (singleProduct, type, ProductQuantity) => {
    const { cartDispatch } = this.context;
    //  Decrease quantity
    if (type === "dec") {
      if (ProductQuantity > 0) {
        cartDispatch(
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
      cartDispatch(
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

  setViewCart = (showOverflow) => {
    // const {showMiniCart} = this.state;
    this.setState((prevState) => ({ showMiniCart: !prevState }));
    this.setScroll(showOverflow);
  };
  switchCurrency = (e, singleCurrency) => {
    const { currencyDispatch } = this.context;

    switch (e.target.innerText.split(" ")[0]) {
      case "USD":
        currencyDispatch(toUSD());
        break;
      case "GBP":
        currencyDispatch(toGBP());
        break;
      case "AUD":
        currencyDispatch(toAUD());
        break;
      case "JPY":
        currencyDispatch(toJPY());
        break;
      case "RUB":
        currencyDispatch(toRUB());
        break;

      default:
        currencyDispatch(toUSD());
        break;
    }
  };

  render() {
    const { currencyDispatch } = this.context;
    const { currencyState } = this.context;
    const { baseConverter, currency } = currencyState;
    const { cartState, categoryState } = this.context;
    const { category } = categoryState;
    // categoryState && localStorage.setItem("cat", category);
    const { cart, total } = cartState;
    const dispContentSet = new Set(cart);
    const dispContent = Array.from(dispContentSet);
    const { showScroll, categories, currentCategorySet, currencies } =
      this.state;
    // console.log(category);
    console.log(currentCategorySet);

    return (
      <div className="navbarContainer">
        <div
          className="navbar"
          // onClick={() => this.closeOverlay()}
        >
          <div className="navLeft">
            <ul>
              {categories &&
                categories.map((category) => {
                  console.log(category);
                  return (
                    <Link to="/" key={category.name}>
                      <li>
                        <div
                          role="link"
                          tabIndex={0}
                          className={`navLeftList ${
                            category.name ===
                              currentCategorySet.toLowerCase() && "active"
                          }`}
                          onClick={(e) => this.handleClick(e, showScroll)}
                          // onKeyDown={(e) => this.handleClick(e, showScroll)}
                        >
                          {category.name.toUpperCase()}
                        </div>
                      </li>
                    </Link>
                  );
                })}
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
                {currencies &&
                  currencies.map((singleCurrency) => {
                    return (
                      <li key={singleCurrency.label} className="currencyList">
                        <div
                          role="button"
                          tabIndex={0}
                          // className="currencyList"
                          onClick={(e) =>
                            this.switchCurrency(e, singleCurrency.label)
                          }
                          // onKeyDown={() => {
                          //   currencyDispatch(`to${currency.label}`());
                          // }}
                        >
                          {singleCurrency.label} {singleCurrency.symbol}
                        </div>
                      </li>
                    );
                  })}
              </div>
            </div>
            <div
              className="cartIconContainer"
              showminicart={this.state.showMiniCart.toString()}
            >
              <FontAwesomeIcon
                icon={faCartShopping}
                className="cartIcon"
                onClick={() => this.showMiniCart(this.state.showScroll)}
              />
              <span className="cartIconBadge">{cart.length}</span>
              <div className="miniCartWrapper">
                <div
                  className="cartOverlay"
                  onClick={() => this.showMiniCart(this.state.showScroll)}
                ></div>
                {this.state.showMiniCart && (
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
                                          Object.keys(attribute)[0] === "color"
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
                                          // ProductQuantity,

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
                                          // ProductQuantity,

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
                                        <div className="loader"></div>
                                      ) : (
                                        cart.filter((v) => v === singleProduct)
                                          .length
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
                                          // ProductQuantity,

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
                                          // ProductQuantity,

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
                                  <img src={singleProduct.gallery[0]} alt="" />
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="miniCartTotal">Cart is empty</div>
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
                          <div
                            onClick={() =>
                              this.setViewCart(this.state.showScroll)
                            }
                          >
                            VIEW BAG
                          </div>
                        </Link>
                        <div className="checkOut">CHECKOUT</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// Navbar.contextType = GlobalContext;

