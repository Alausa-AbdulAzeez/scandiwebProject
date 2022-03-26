import { gql } from "apollo-boost";
import React, { Component, useEffect } from "react";
import { client } from "../../App";
import Navbar from "../../components/navbar/Navbar";
// import { CategoryContext } from "../../context/categoryContext/CategoryContext";
import { GlobalContext } from "../../context/Provider/Provider";
import "./product.css";
import parse from "html-react-parser";
import {
  addProduct,
  removeProduct,
} from "../../context/cartContext/CartActions";

import "react-slideshow-image/dist/styles.css";
import SimpleImageSlider from "react-simple-image-slider";
import { faCancel, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { increaseProductAmount } from "../../context/quantityContext/QuantityActions";
<link rel="stylesheet" href="carousel.css" />;

// const HTML = require("html-parse-stringify");

export default class Product extends Component {
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

  get_product = async () => {
    client
      .query({
        query: gql`
          query getId {
            product(id: "${this.state.id}") {
              id
              name
              inStock
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
  removeColor = () => {
    const colorList = document.querySelectorAll(".selectedColor");
    colorList.forEach((item) => item.classList.remove("selectedColor"));
  };

  addColor = (e) => {
    e.target.classList.add("selectedColor");
  };

  removeAttribute = (attribute) => {
    let className = `selected${attribute}`;
    let modClassName = className.split(" ").join("");
    // console.log(modClassName);
    const sizeList = document.querySelectorAll(`.${modClassName}`);
    sizeList.forEach((item) => item.classList.remove(`${modClassName}`));
  };

  addAttribute = (e, attribute) => {
    // console.log(attribute);
    // this.setState(...this.state.att, { att: attribute });
    this.setState({ att: [...this.state.att, attribute] });
    let className = `selected${attribute}`;
    let modClassName = className.split(" ").join("");
    e.target.classList.add(`${modClassName}`);
  };

  selectAttribute = (product, e, attribute, type) => {
    if (type === "default") {
      this.removeAttribute(attribute);
      this.addAttribute(e, attribute);
      this.setState({
        arr: [...this.state.arr, { [attribute]: e.target.innerText }],
      });

      if (product.attributes.length === this.state.arr.length + 1) {
        this.setState({ disabled: false });
      }
    } else {
      this.removeAttribute(attribute);
      this.addAttribute(e, attribute);
      this.setState({
        varArr: [...this.state.varArr, { [attribute]: e.target.innerText }],
      });

      if (
        this.state.product.attributes.length ===
        this.state.varArr.length + 1
      ) {
        this.setState({ variationBtnDisabled: false });
      }
    }
  };
  selectColor = (product, e, value, type) => {
    if (type === "default") {
      this.removeColor();
      this.addColor(e);
      this.setState({
        arr: [...this.state.arr, { color: value }],
      });
      console.log(this.state.arr);

      if (product.attributes.length === this.state.arr.length + 1) {
        this.setState({ disabled: false });
        // this.setState({ variationBtnDisabled: false });
      }
    } else {
      this.removeColor();
      this.addColor(e);
      this.setState({
        varArr: [...this.state.varArr, { color: value }],
      });

      if (product.attributes.length === this.state.varArr.length + 1) {
        this.setState({ variationBtnDisabled: false });
      }
    }
  };

  addToCart = (product, e) => {
    if (product.attributes.length === 0) {
      this.context.cartDispatch(
        addProduct({
          product,
          price: product.prices[0].amount,
          quantity: 1,
        })
      );
    } else {
      let newArr = this.state.arr.slice(-product.attributes.length);
      // let  = this.state.arr.slice(-product.attributes.length);
      this.setState({ attArr: newArr });
      let cartProduct = {
        ...product,
        attributes: newArr,
        idInCart:
          new Date().valueOf().toString(36) +
          Math.random().toString(36).substr(2),
      };

      product !== null &&
        this.context.cartDispatch(
          addProduct({
            product: cartProduct,
            price: product.prices[0].amount,
            quantity: 1,
          })
        );
      this.setState({ arr: [] });
      this.removeColor();
      for (let index = 0; index <= this.state.att.length; index++) {
        this.removeAttribute(this.state.att[index]);
      }
      this.setState({ disabled: true });
      this.setState({ productInCart: cartProduct });
    }
  };

  ProdhandleQuantity = (singleProduct, type, ProductQuantity, ab) => {
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
        this.setState({ quantity: ProductQuantity + 1 });
        this.context.quantityDispatch(increaseProductAmount());
        this.context.cartDispatch(
          addProduct({
            product: this.state.product,
            price: singleProduct.prices[0].amount,
            quantity: ProductQuantity,
          })
        );
        this.setState({ disabledRemove: true });
        setTimeout(() => {
          this.setState({ disabledRemove: false });
        }, 500);
      } else {
        console.log(singleProduct);
        let newArr = this.state.attArr.slice(-singleProduct.attributes.length);
        let cartProduct = { ...singleProduct, attributes: newArr };
        this.context.quantityDispatch(increaseProductAmount());

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
  showOverlay = () => {
    document.body.style.overflow = "hidden";
    const overlay = document.querySelector(".variationContainer");
    overlay.classList.add("show");
  };
  removeOverlay = () => {
    document.body.style.overflowY = "scroll";
    const overlay = document.querySelector(".variationContainer");
    overlay.classList.remove("show");
  };
  setVariation = (singleProduct, e, ProductQuantity) => {
    let newArr = this.state.varArr.slice(-singleProduct.attributes.length);
    let variedProduct = {
      ...singleProduct,
      attributes: newArr,
      idInCart:
        new Date().valueOf().toString(36) +
        Math.random().toString(36).substr(2),
    };

    // this.context.quantityDispatch(increaseProductAmount());

    this.context.cartDispatch(
      addProduct({
        product: variedProduct,
        price: variedProduct.prices[0].amount,
        quantity: 1,
      })
    );
    this.setState({ variationBtnDisabled: true });
    this.setState({ varArr: [] });
  };

  render() {
    const { currency, baseConverter } = this.context.currencyState;
    const { quantity, cart } = this.context.cartState;
    const { ProductQuantity } = this.context.quantityState;

    const dispContentSet = new Set(cart);
    const dispContent = Array.from(dispContentSet);
    localStorage.setItem("cart", JSON.stringify(cart));
    // {
    //   console.log(this.state.product);
    // }

    // let dispContent = cart.filter(
    //   (v, i, a) => a.findIndex((v2) => v2.attributes === v.attributes) === i
    // );

    console.log(cart);
    // console.log(dispContent);

    localStorage.removeItem("cart");

    // const { id, gallery, prices, name } = this.state.product;
    // this.state.product && console.log(this.state.product);
    // console.log(gallery);

    return (
      <>
        {this.state.product && (
          <div className="variationContainer" ab={"yes"}>
            <div className="variationContentContainer">
              <div className="containerTop">
                <h3 className="variationTitle">Please select a variation</h3>
                <button
                  disabled={this.state.variationBtnDisabled}
                  className="addVariation"
                  onClick={(e) =>
                    this.setVariation(
                      this.state.product,

                      e,
                      ProductQuantity
                    )
                  }
                >
                  Add
                </button>
                <span onClick={this.removeOverlay}>
                  <FontAwesomeIcon icon={faClose} className="" />
                </span>
              </div>
              <div className="containerBottom">
                {this.state.product &&
                  this.state.product.attributes.length > 0 &&
                  this.state.product.attributes.map((attribute) => {
                    if (attribute.id === "Color") {
                      return (
                        <div
                          className="variationProductColorWrapper"
                          key={attribute.id}
                        >
                          <div className="VariationSizeText">Color:</div>
                          {attribute.items.map((colorType) => {
                            const { value, id } = colorType;
                            return (
                              <div
                                className="variationSelecTedColorWrapper"
                                key={id}
                              >
                                <div
                                  className="variationProductDisplayColor"
                                  style={{
                                    backgroundColor: `${value}`,
                                  }}
                                  key={id}
                                  onClick={(e) =>
                                    this.selectColor(
                                      this.state.product,
                                      e,
                                      value,
                                      "variation"
                                    )
                                  }
                                ></div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className="variationProductSizeWrapper"
                          key={attribute.id}
                        >
                          <div className="variationSizeText">
                            {attribute.id}:
                          </div>
                          {attribute.items.map((item) => {
                            return (
                              <div
                                className="variationProductSize"
                                onClick={(e) =>
                                  this.selectAttribute(
                                    this.state.product,
                                    e,
                                    attribute.id,
                                    "variation"
                                  )
                                }
                                key={item.id}
                              >
                                {item.value}
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                  })}
                <div className="miniCartContents">
                  {this.state.product && dispContent.length > 0 ? (
                    dispContent.map((singleProduct) => {
                      if (this.state.product.name === singleProduct.name) {
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
                                  singleProduct.prices[0].amount * baseConverter
                                ).toFixed(2)}
                              </div>
                              <div className="miniCartProductSizes">
                                {singleProduct.attributes.length > 0 &&
                                  singleProduct.attributes.map((attribute) => {
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
                              <div className="variationSet">
                                <button
                                  disabled={this.state.disabledRemove}
                                  className="variationAdd"
                                  onClick={() =>
                                    this.ProdhandleQuantity(
                                      singleProduct,
                                      "inc",
                                      ProductQuantity,

                                      cart.filter((v) => v === singleProduct)
                                        .length
                                    )
                                  }
                                >
                                  +
                                </button>
                                <div className="variationQuantity">
                                  {this.state.disabledRemove ? (
                                    <div className="loader"></div>
                                  ) : (
                                    cart.filter((v) => v === singleProduct)
                                      .length
                                  )}
                                </div>
                                <button
                                  disabled={this.state.disabledRemove}
                                  className="variationRemove"
                                  onClick={() =>
                                    this.ProdhandleQuantity(
                                      singleProduct,
                                      "dec",
                                      ProductQuantity,
                                      cart.filter((v) => v === singleProduct)
                                        .length
                                    )
                                  }
                                >
                                  -
                                </button>
                              </div>
                              <div className="miniCartImg">
                                <img src={singleProduct.gallery[0]} alt="" />
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })
                  ) : (
                    <div className="miniCartTotal">ABC</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <Navbar />
        {this.state.product && (
          <div className="productPageWrapper">
            <div className="productContainer">
              <div className="productContainerLeft">
                {this.state.product.gallery.map((singleImage) => {
                  return (
                    <div className="smallImage" key={singleImage}>
                      <img src={singleImage} alt="" key={singleImage} />
                    </div>
                  );
                })}
              </div>
              <div className="productContainerCenter">
                <div className="mainProductImg">
                  <SimpleImageSlider
                    width={400}
                    height={400}
                    images={this.state.product.gallery}
                    showBullets={true}
                    showNavs={true}
                    autoPlay={true}
                    navStyle={{
                      objectFit: "contain",
                      cursor: "progress",
                    }}
                  />
                </div>
                {/* <img
                  src={this.state.product.gallery[0]}
                  alt=""
                  className="mainProductImg"
                /> */}
              </div>
              <div className="productContainerRight">
                <div className="productTitle">
                  {this.state.product.name.split(" ").slice(0, 1)}
                  <br />
                  <span>
                    {this.state.product.name.split(" ").slice(1).join(" ")}
                  </span>
                </div>
                <div className="productSizes">
                  <h5>Please select desired specification(s)</h5>
                  {this.state.product.attributes.length > 0 &&
                    this.state.product.attributes.map((attribute) => {
                      if (attribute.id === "Color") {
                        return (
                          <div
                            className="productColorWrapper"
                            key={attribute.id}
                          >
                            <div className="sizeText">COLOR:</div>
                            {attribute.items.map((colorType) => {
                              const { value, id } = colorType;
                              return (
                                <div className=" selecTedColorWrapper" key={id}>
                                  <div
                                    className="productDisplayColor"
                                    style={{
                                      backgroundColor: `${value}`,
                                    }}
                                    key={id}
                                    onClick={(e) =>
                                      this.selectColor(
                                        this.state.product,
                                        e,
                                        value,
                                        "default"
                                      )
                                    }
                                  ></div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      } else {
                        return (
                          <div
                            className="productSizeWrapper"
                            key={attribute.id}
                          >
                            <div className="sizeText">{attribute.id}:</div>
                            {attribute.items.map((item) => {
                              return (
                                <div
                                  className="productSize"
                                  onClick={(e) =>
                                    this.selectAttribute(
                                      this.state.product,
                                      e,
                                      attribute.id,
                                      "default"
                                    )
                                  }
                                  key={item.id}
                                >
                                  {item.value}
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                    })}
                </div>
                <div className="productPrice2">
                  <div className="productPrice1">PRICE:</div>
                  {currency}
                  {(
                    this.state.product.prices[0].amount * baseConverter
                  ).toFixed(2)}
                </div>

                <div
                  className="productBtn"
                  // onClick={(e) => this.addToCart(this.state.product, e)}
                >
                  {this.state.product.attributes.length === 0 ? (
                    cart.some((cartItem) => cartItem === this.state.product) ===
                    true ? (
                      <div className="productQuantitySet">
                        <div
                          className="productPageAdd"
                          onClick={(e) =>
                            this.ProdhandleQuantity(
                              this.state.product,
                              "inc",
                              e,
                              ProductQuantity
                            )
                          }
                        >
                          +
                        </div>
                        <div className="productPageQuantity">
                          {cart.length > 0 &&
                            cart.filter((v) => v === this.state.product).length}
                        </div>
                        <div
                          className="productPageRemove"
                          onClick={(e) =>
                            this.ProdhandleQuantity(
                              this.state.product,
                              "dec",
                              e,
                              ProductQuantity
                            )
                          }
                        >
                          -
                        </div>
                      </div>
                    ) : (
                      <button
                        className="defaultAddToCart"
                        onClick={(e) => this.addToCart(this.state.product, e)}
                      >
                        ADD TO CART
                      </button>
                    )
                  ) : cart.some(
                      (cartItem) => cartItem.id === this.state.product.id
                    ) === true ? (
                    <div className="productQuantitySet">
                      {/* {console.log(this.state.product)} */}
                      <div
                        className="productPageAdd"
                        onClick={this.showOverlay}
                        // onClick={(e) =>
                        //   this.ProdhandleQuantity(
                        //     this.state.productInCart,
                        //     "inc",
                        //     e,
                        //     ProductQuantity
                        //   )
                        // }
                      >
                        +
                      </div>
                      <div className="productPageQuantity">
                        {cart.length > 0 &&
                          cart.filter((v) => v.id === this.state.product.id)
                            .length}
                      </div>
                      <div
                        className="productPageRemove"
                        onClick={this.showOverlay}
                        // onClick={(e) =>
                        //   this.ProdhandleQuantity(
                        //     this.state.productInCart,
                        //     "dec",
                        //     e,
                        //     ProductQuantity
                        //   )
                        // }
                      >
                        -
                      </div>
                    </div>
                  ) : (
                    <button
                      className="addToCart"
                      disabled={this.state.disabled}
                      onClick={(e) => this.addToCart(this.state.product, e)}
                    >
                      ADD TO CART
                    </button>
                  )}
                </div>
                <div className="productDesc">
                  {parse(this.state.product.description)}
                  {/* {HTML.parse(this.state.product.description)} */}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
