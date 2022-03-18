import { useQuery } from "@apollo/client";
import {
  faShoppingBasket,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { client } from "../../App";
import { CategoryContext } from "../../context/categoryContext/CategoryContext";
import { GlobalContext } from "../../context/Provider/Provider";
import { GET_PRODUCTS, GET_PRODUCTS2 } from "../../GraphQL/Queries";
import { gql } from "apollo-boost";
import "./category.css";
import { Outlet, Link } from "react-router-dom";
import { addProduct } from "../../context/cartContext/CartActions";

export class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inCart: false,
      showCount: "true",
      products: null,
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
    if (product.inStock.toString() === "false") {
      e.preventDefault();
    } else {
      console.log(product);
      this.context.cartDispatch(
        addProduct({
          product,
          price: product.prices[0].amount,
          quantity: 1,
        })
      );
    }
  };
  handleOutOfStock = (product, e) => {
    if (product.inStock.toString() === "false") {
      e.preventDefault();
    }
  };

  render() {
    const { category } = this.context.categoryState;
    const { currency, baseConverter } = this.context.currencyState;
    const ab = this.context.cartState;
    console.log(ab);

    return (
      <div className="categoryContainer">
        <div className="categoryTitle">{category}</div>
        <div className="categoryItems">
          {this.state.products &&
            (category === "ALL"
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
                        <span
                          className="itemIconContainer"
                          onClick={(e) => this.addToCart(product, e)}
                        >
                          <FontAwesomeIcon
                            icon={faShoppingCart}
                            className="ItembagIcon"
                          />
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
                      <div className="categoryItem ">
                        <Link to={`/${id}`}>
                          <div
                            className="categoryItemTop"
                            instock={inStock.toString()}
                            key={id}
                            aria-disabled="true"
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
                          <span
                            className="itemIconContainer"
                            onClick={() => this.addToCart(filteredProduct)}
                          >
                            <FontAwesomeIcon
                              icon={faShoppingCart}
                              className="ItembagIcon"
                            />
                          </span>
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
