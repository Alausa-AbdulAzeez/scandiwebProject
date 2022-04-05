import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
import { client } from "../../App";
import { GlobalContext } from "../../context/Provider/Provider";
import "./category.css";
import {
  addProduct,
  removeProduct,
} from "../../context/cartContext/CartActions";
// import { increaseProductAmount } from '../../context/quantityContext/QuantityActions';

export class Category extends React.Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      products: null,
      clicked: false,
      cat: "all",
      category: "all",
      // cat: localStorage.getItem("cat").toLowerCase() || null,
      // category: localStorage.getItem("cat").toLowerCase() || null,
    };
  }

  componentDidMount() {
    // this.get_products();
    this.getCat();
    this.setState({
      category: localStorage.getItem("cat").toLowerCase() || null,
    });
    this.setState({
      products: localStorage.getItem("cat").toLowerCase() || null,
    });
  }

  getCat() {
    this.setState({
      category: this.context.categoryState.category.toLowerCase(),
    });

    // console.log(this.context.categoryState.category.toLowerCase());
  }

  // getProductsAndCategory = (result) => {
  //   console.log(result);
  //   this.state.category && console.log(this.state.category);
  //   this.setState({ products: result.data.category.products });
  //   this.setState({ data: result.data });
  // };

  // get_products = async () => {
  //   client
  //     .query({
  //       query: gql`
  //         query getCategory {
  //           category(input: { title: "${this.state.category || "all"}" }) {
  //             name
  //             products {
  //               id
  //               name
  //               inStock
  //               gallery
  //               description
  //               category
  //               attributes {
  //                 id
  //                 name
  //                 type
  //                 items {
  //                   displayValue
  //                   value
  //                   id
  //                 }
  //               }
  //               prices {
  //                 currency {
  //                   symbol
  //                 }
  //                 amount
  //               }
  //               brand
  //             }
  //           }
  //         }
  //       `,
  //     })
  //     .then((result) => this.getProductsAndCategory(result));
  // };
  // get_products = async () => {
  //   client
  //     .query({
  //       query: gql`
  //         query {
  //           categories {
  //             name
  //             products {
  //               id
  //               name
  //               inStock
  //               gallery
  //               description
  //               category
  //               attributes {
  //                 id
  //                 name
  //                 type
  //                 items {
  //                   displayValue
  //                   value
  //                   id
  //                 }
  //               }
  //               prices {
  //                 currency {
  //                   symbol
  //                 }
  //                 amount
  //               }
  //               brand
  //             }
  //           }
  //         }
  //       `,
  //     })
  //     .then((result) => this.getProductsAndCategory(result));
  // };

  addToCart = (product, e) => {
    const { cartDispatch } = this.context;
    if (product.inStock.toString() === "false") {
      e.preventDefault();
    } else {
      if (product.attributes.length === 0) {
        cartDispatch(
          addProduct({
            product,
            price: product.prices[0].amount,
            quantity: 1,
          })
        );
      }
      const { clicked } = this.state;
      this.setState({ clicked: !clicked });
    }
  };

  handleOutOfStock = (product, e) => {
    if (product.inStock.toString() === "false") {
      e.preventDefault();
    }
  };

  increaseQuantity = (
    singleProduct,
    type,
    ProductQuantity,
    quantityInCart,
    cart
  ) => {
    const { cartDispatch } = this.context;
    console.log(this.context);
    if (type === "dec") {
      if (quantityInCart > 0) {
        cartDispatch(
          removeProduct({
            product: singleProduct,
            price: singleProduct.prices[0].amount,
            quantity: 1,
          })
        );
      }
    }
    if (type === "inc") {
      if (singleProduct.attributes.length === 0) {
        const itemInCart = cart.find(
          (cartProduct) => cartProduct.id === singleProduct.id
        );
        if (itemInCart) {
          cartDispatch(
            addProduct({
              product: itemInCart,
              price: singleProduct.prices[0].amount,
              quantity: 1,
            })
          );
        } else {
          cartDispatch(
            addProduct({
              product: singleProduct,
              price: singleProduct.prices[0].amount,
              quantity: 1,
            })
          );
        }
      } else {
        // const newArr = this.state.attArr.slice(
        //   -singleProduct.attributes.length
        // );
        // const cartProduct = { ...singleProduct, attributes: newArr };
        context.cartDispatch(
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
    const { context } = this;
    const { category } = context.categoryState;
    const { currency, baseConverter } = context.currencyState;
    const { cart } = context.cartState;
    // const { products } = this.state;
    const { data } = this.state;
    console.log(this.context.productsState);

    const { products } = this.context.productsState;

    // this.getCategory();
    // console.log(category);

    return (
      <div className="categoryContainer">
        <div className="categoryTitle">{category}</div>
        <div className="categoryItems">
          {products &&
            products.map((product) => {
              const { inStock, id, gallery, prices, name } = product;
              return (
                <div
                  className="categoryItem"
                  instock={inStock.toString()}
                  key={id}
                >
                  <Link
                    to={`/${id}`}
                    onClick={(e) => this.handleOutOfStock(product, e)}
                  >
                    <div
                      className="categoryItemTop"
                      instock={inStock.toString()}
                    >
                      <div className="outOfStock">
                        <h3 className="outOfStockText">OUT OF STOCK</h3>
                      </div>
                      <div className="imgContainer">
                        <img src={gallery[0]} alt="" className="categoryImg" />
                      </div>
                    </div>
                  </Link>
                  <div className="categoryItemBottom">
                    <div className="catDescContainer">
                      <div className="categoryName">{name}</div>
                      <div className="categoryPrice">
                        {currency}
                        {(prices[0].amount * baseConverter).toFixed(2)}
                      </div>
                    </div>
                    <span>
                      {product.attributes.length === 0 ? (
                        cart.some((cartItem) => cartItem.id === product.id) ===
                        true ? (
                          <div className="quantitySet">
                            <div
                              className="miniCartAdd"
                              role="button"
                              tabIndex={0}
                              onClick={() =>
                                this.increaseQuantity(
                                  product,
                                  "inc",
                                  1,
                                  cart.length > 0 &&
                                    cart.filter((v) => v.id === product.id)
                                      .length,
                                  cart
                                )
                              }
                              onKeyDown={() =>
                                this.increaseQuantity(
                                  product,
                                  "inc",
                                  1,
                                  cart.length > 0 &&
                                    cart.filter((v) => v.id === product.id)
                                      .length,
                                  cart
                                )
                              }
                            >
                              +
                            </div>
                            <div className="miniCartQuantity">
                              {cart.length > 0 &&
                                cart.filter((v) => v.id === product.id).length}
                            </div>
                            <div
                              className="miniCartRemove"
                              role="button"
                              tabIndex={0}
                              onClick={() =>
                                this.increaseQuantity(
                                  product,
                                  "dec",
                                  1,
                                  cart.length > 0 &&
                                    cart.filter((v) => v.id === product.id)
                                      .length
                                )
                              }
                              onKeyDown={() =>
                                this.increaseQuantity(
                                  product,
                                  "dec",
                                  1,
                                  cart.length > 0 &&
                                    cart.filter((v) => v.id === product.id)
                                      .length
                                )
                              }
                            >
                              -
                            </div>
                          </div>
                        ) : (
                          <span
                            className="itemIconContainer"
                            onClick={(e) => this.addToCart(product, e)}
                            onKeyDown={(e) => this.addToCart(product, e)}
                            role="button"
                            tabIndex={0}
                          >
                            <FontAwesomeIcon
                              icon={faShoppingCart}
                              className="ItembagIcon"
                            />
                          </span>
                        )
                      ) : (
                        <Link to={`/${id}`}>
                          <span className="itemIconContainer">
                            <FontAwesomeIcon
                              icon={faShoppingCart}
                              className="ItembagIcon"
                            />
                          </span>
                        </Link>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          {/* {products &&
            (category === "ALL"
              ? products.map((product) => {
                  const { inStock, id, gallery, prices, name } = product;
                  return (
                    <div
                      className="categoryItem"
                      instock={inStock.toString()}
                      key={id}
                    >
                      <Link
                        to={`/${id}`}
                        onClick={(e) => this.handleOutOfStock(product, e)}
                      >
                        <div
                          className="categoryItemTop"
                          instock={inStock.toString()}
                        >
                          <div className="outOfStock">
                            <h3 className="outOfStockText">OUT OF STOCK</h3>
                          </div>
                          <div className="imgContainer">
                            <img
                              src={gallery[0]}
                              alt=""
                              className="categoryImg"
                            />
                          </div>
                        </div>
                      </Link>
                      <div className="categoryItemBottom">
                        <div className="catDescContainer">
                          <div className="categoryName">{name}</div>
                          <div className="categoryPrice">
                            {currency}
                            {(prices[0].amount * baseConverter).toFixed(2)}
                          </div>
                        </div>
                        <span>
                          {product.attributes.length === 0 ? (
                            cart.some(
                              (cartItem) => cartItem.id === product.id
                            ) === true ? (
                              <div className="quantitySet">
                                <div
                                  className="miniCartAdd"
                                  role="button"
                                  tabIndex={0}
                                  onClick={() =>
                                    this.increaseQuantity(
                                      product,
                                      "inc",
                                      1,
                                      cart.length > 0 &&
                                        cart.filter((v) => v.id === product.id)
                                          .length,
                                      cart
                                    )
                                  }
                                  onKeyDown={() =>
                                    this.increaseQuantity(
                                      product,
                                      "inc",
                                      1,
                                      cart.length > 0 &&
                                        cart.filter((v) => v.id === product.id)
                                          .length,
                                      cart
                                    )
                                  }
                                >
                                  +
                                </div>
                                <div className="miniCartQuantity">
                                  {cart.length > 0 &&
                                    cart.filter((v) => v.id === product.id)
                                      .length}
                                </div>
                                <div
                                  className="miniCartRemove"
                                  role="button"
                                  tabIndex={0}
                                  onClick={() =>
                                    this.increaseQuantity(
                                      product,
                                      "dec",
                                      1,
                                      cart.length > 0 &&
                                        cart.filter((v) => v.id === product.id)
                                          .length
                                    )
                                  }
                                  onKeyDown={() =>
                                    this.increaseQuantity(
                                      product,
                                      "dec",
                                      1,
                                      cart.length > 0 &&
                                        cart.filter((v) => v.id === product.id)
                                          .length
                                    )
                                  }
                                >
                                  -
                                </div>
                              </div>
                            ) : (
                              <span
                                className="itemIconContainer"
                                onClick={(e) => this.addToCart(product, e)}
                                onKeyDown={(e) => this.addToCart(product, e)}
                                role="button"
                                tabIndex={0}
                              >
                                <FontAwesomeIcon
                                  icon={faShoppingCart}
                                  className="ItembagIcon"
                                />
                              </span>
                            )
                          ) : (
                            <Link to={`/${id}`}>
                              <span className="itemIconContainer">
                                <FontAwesomeIcon
                                  icon={faShoppingCart}
                                  className="ItembagIcon"
                                />
                              </span>
                            </Link>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })
              : this.state.products
                  .filter(
                    (product) => product.category === category.toLowerCase()
                  )
                  .map((filteredProduct) => {
                    const { inStock, id, gallery, prices, name } =
                      filteredProduct;
                    return (
                      <div
                        className="categoryItem"
                        instock={inStock.toString()}
                        key={id}
                      >
                        <Link
                          to={`/${id}`}
                          onClick={(e) =>
                            this.handleOutOfStock(filteredProduct, e)
                          }
                        >
                          <div
                            className="categoryItemTop"
                            instock={inStock.toString()}
                          >
                            <div className="outOfStock">
                              <h3 className="outOfStockText">OUT OF STOCK</h3>
                            </div>
                            <div className="imgContainer">
                              <img
                                src={gallery[0]}
                                alt=""
                                className="categoryImg"
                              />
                            </div>
                          </div>
                        </Link>
                        <div className="categoryItemBottom">
                          <div className="catDescContainer">
                            <div className="categoryName">{name}</div>
                            <div className="categoryPrice">
                              {currency}
                              {(prices[0].amount * baseConverter).toFixed(2)}
                            </div>
                          </div>
                          <span>
                            {filteredProduct.attributes.length === 0 ? (
                              cart.some(
                                (cartItem) => cartItem.id === filteredProduct.id
                              ) === true ? (
                                <div className="quantitySet">
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    className="miniCartAdd"
                                    onClick={() =>
                                      this.increaseQuantity(
                                        filteredProduct,
                                        "inc",
                                        1,
                                        cart.length > 0 &&
                                          cart.filter(
                                            (v) => v.id === filteredProduct.id
                                          ).length,
                                        cart
                                      )
                                    }
                                    onKeyDown={() =>
                                      this.increaseQuantity(
                                        filteredProduct,
                                        "inc",
                                        1,
                                        cart.length > 0 &&
                                          cart.filter(
                                            (v) => v.id === filteredProduct.id
                                          ).length,
                                        cart
                                      )
                                    }
                                  >
                                    +
                                  </div>
                                  <div className="miniCartQuantity">
                                    {cart.length > 0 &&
                                      cart.filter(
                                        (v) => v.id === filteredProduct.id
                                      ).length}
                                  </div>
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    className="miniCartRemove"
                                    onClick={() =>
                                      this.increaseQuantity(
                                        filteredProduct,
                                        "dec",
                                        1,
                                        cart.length > 0 &&
                                          cart.filter(
                                            (v) => v.id === filteredProduct.id
                                          ).length,
                                        cart
                                      )
                                    }
                                    onKeyDown={() =>
                                      this.increaseQuantity(
                                        filteredProduct,
                                        "dec",
                                        1,
                                        cart.length > 0 &&
                                          cart.filter(
                                            (v) => v.id === filteredProduct.id
                                          ).length,
                                        cart
                                      )
                                    }
                                  >
                                    -
                                  </div>
                                </div>
                              ) : (
                                <span
                                  role="button"
                                  tabIndex={0}
                                  className="itemIconContainer"
                                  onClick={(e) =>
                                    this.addToCart(filteredProduct, e)
                                  }
                                  onKeyDown={(e) =>
                                    this.addToCart(filteredProduct, e)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faShoppingCart}
                                    className="ItembagIcon"
                                  />
                                </span>
                              )
                            ) : (
                              <Link to={`/${id}`}>
                                <span className="itemIconContainer">
                                  <FontAwesomeIcon
                                    icon={faShoppingCart}
                                    className="ItembagIcon"
                                  />
                                </span>
                              </Link>
                            )}
                          </span>
                         
                        </div>
                      </div>
                    );
                  }))} */}
        </div>
      </div>
    );
  }
}
// Category.contextType = GlobalContext;
export default Category;

