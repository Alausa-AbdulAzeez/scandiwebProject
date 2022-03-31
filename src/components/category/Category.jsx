import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { client } from '../../App';
import { GlobalContext } from '../../context/Provider/Provider';
import { gql } from 'apollo-boost';
import './category.css';
import { Link } from 'react-router-dom';
import {
  addProduct,
  removeProduct,
} from '../../context/cartContext/CartActions';
import { increaseProductAmount } from '../../context/quantityContext/QuantityActions';

export class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: null,
      clicked: false,
    };
  }

  static contextType = GlobalContext;

  get_products = async () => {
    client
      .query({
        query: gql`
          query {
            categories {
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
        return this.setState({ products: result.data.categories[0].products });
      });
  };

  componentDidMount() {
    this.get_products();
  }
  addToCart = (product, e) => {
    if (product.inStock.toString() === 'false') {
      e.preventDefault();
    } else {
      if (product.attributes.length === 0) {
        this.context.cartDispatch(
          addProduct({
            product,
            price: product.prices[0].amount,
            quantity: 1,
          })
        );
      } else {
      }

      this.setState({ clicked: !this.state.clicked });
    }
  };
  handleOutOfStock = (product, e) => {
    if (product.inStock.toString() === 'false') {
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
    if (type === 'dec') {
      if (quantityInCart > 0) {
        this.context.cartDispatch(
          removeProduct({
            product: singleProduct,
            price: singleProduct.prices[0].amount,
            quantity: 1,
          })
        );
      }
    }
    if (type === 'inc') {
      if (singleProduct.attributes.length === 0) {
        let itemInCart = cart.find(
          (cartProduct) => cartProduct.id === singleProduct.id
        );
        if (itemInCart) {
          this.context.cartDispatch(
            addProduct({
              product: itemInCart,
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
      } else {
        let newArr = this.state.attArr.slice(-singleProduct.attributes.length);
        let cartProduct = { ...singleProduct, attributes: newArr };
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
    const { category } = this.context.categoryState;
    const { currency, baseConverter } = this.context.currencyState;
    const { cart } = this.context.cartState;

    return (
      <div className="categoryContainer">
        <div className="categoryTitle">{category}</div>
        <div className="categoryItems">
          {this.state.products &&
            (category === 'ALL'
              ? this.state.products.map((product) => {
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
                                  onClick={(e) =>
                                    this.increaseQuantity(
                                      product,
                                      'inc',
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
                                  onClick={(e) =>
                                    this.increaseQuantity(
                                      product,
                                      'dec',
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
                                    className="miniCartAdd"
                                    onClick={(e) =>
                                      this.increaseQuantity(
                                        filteredProduct,
                                        'inc',
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
                                    className="miniCartRemove"
                                    onClick={(e) =>
                                      this.increaseQuantity(
                                        filteredProduct,
                                        'dec',
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
                                  className="itemIconContainer"
                                  onClick={(e) =>
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
                          {/* <span className="">
                            {filteredProduct.attributes.length === 0 &&
                            cart.some(
                              (cartItem) => cartItem === filteredProduct
                            ) === true ? (
                              <div className="quantitySet">
                                <div
                                  className="miniCartAdd"
                                  onClick={(e) =>
                                    this.increaseQuantity(
                                      filteredProduct,
                                      "inc",
                                      1,
                                      cart.length > 0 &&
                                        cart.filter(
                                          (v) => v === filteredProduct
                                        ).length
                                    )
                                  }
                                >
                                  +
                                </div>
                                <div className="miniCartQuantity">
                                  {cart.length > 0 &&
                                    cart.filter((v) => v === filteredProduct)
                                      .length}
                                </div>
                                <div
                                  className="miniCartRemove"
                                  onClick={(e) =>
                                    this.increaseQuantity(
                                      filteredProduct,
                                      "dec",
                                      1,
                                      cart.length > 0 &&
                                        cart.filter(
                                          (v) => v === filteredProduct
                                        ).length
                                    )
                                  }
                                >
                                  -
                                </div>
                              </div>
                            ) : filteredProduct.attributes.length === 0 ? (
                              <span
                                className="itemIconContainer"
                                onClick={(e) =>
                                  this.addToCart(filteredProduct, e)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faShoppingCart}
                                  className="ItembagIcon"
                                />
                              </span>
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
                          </span> */}
                        </div>
                      </div>
                    );
                  }))}
        </div>
      </div>
    );
  }
}

export default Category;

