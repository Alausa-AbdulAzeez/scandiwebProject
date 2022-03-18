import { gql } from "apollo-boost";
import React, { Component, useEffect } from "react";
import { client } from "../../App";
import Navbar from "../../components/navbar/Navbar";
// import { CategoryContext } from "../../context/categoryContext/CategoryContext";
import { GlobalContext } from "../../context/Provider/Provider";
import "./product.css";

export default class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: null,
      id: window.location.href.split("/")[3],
    };
  }
  static contextType = GlobalContext;

  get_product = async () => {
    console.log(this.state.id);
    client
      .query({
        query: gql`
          query getId {
            product(id: "${this.state.id}") {
              id
              name
              category
              gallery
              description
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
        `,
      })
      .then((result) => {
        return this.setState({ product: result.data.product });
      });
  };
  componentDidMount() {
    this.get_product();
  }

  render() {
    const { currency, baseConverter } = this.context.currencyState;
    // const { id, gallery, prices, name } = this.state.product;
    console.log(this.state.product);
    // console.log(gallery);

    return (
      <>
        <Navbar />
        {this.state.product && (
          <div className="productPageWrapper">
            <div className="productContainer">
              <div className="productContainerLeft">
                {this.state.product.gallery.map((singleImage) => {
                  return (
                    <div className="smallImage">
                      <img src={singleImage} alt="" />
                    </div>
                  );
                })}
                {/* <div className="smallImage">
                <img
                  src="https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg"
                  alt=""
                />
              </div>
              <div className="smallImage">
                <img
                  src="https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg"
                  alt=""
                />
              </div> */}
              </div>
              <div className="productContainerCenter">
                <img
                  src={this.state.product.gallery[0]}
                  alt=""
                  className="mainProductImg"
                />
              </div>
              <div className="productContainerRight">
                <div className="productTitle">
                  Apollo <span>running short</span>
                </div>
                <div className="productSizes">
                  <div className="sizeText">SIZE:</div>
                  <div className="sizeContainer">
                    <div className="productSize">XS</div>
                    <div className="productSize">S</div>
                    <div className="productSize">M</div>
                    <div className="productSize">L</div>
                  </div>
                </div>
                <div className="productPrice1">PRICE:</div>
                <div className="productPrice2">
                  {currency}
                  {(10.0 * baseConverter).toFixed(2)}
                </div>
                <div className="productBtn">
                  <div className="addToCart">ADD TO CART</div>
                </div>
                <div className="productDesc">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Atque, distinctio consequatur sequi laudantium voluptate est
                  officia necessitatibus
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
