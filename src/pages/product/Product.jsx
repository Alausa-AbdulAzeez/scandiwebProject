import { gql } from 'apollo-boost';
import React, { Component } from 'react';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { client } from '../../App';
import Navbar from '../../components/navbar/Navbar';
import { GlobalContext } from '../../context/Provider/Provider';
import './product.css';
import {
  addProduct,
  removeProduct,
} from '../../context/cartContext/CartActions';

import 'react-slideshow-image/dist/styles.css';
// import SimpleImageSlider from 'react-simple-image-slider';
import { faClose } from '@fortawesome/free-solid-svg-icons';
// import { increaseProductAmount } from "../../context/quantityContext/QuantityActions";
{
  /* <link rel="stylesheet" href="carousel.css" />; */
}

export default class Product extends Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      productInCart: null,
      id: window.location.href.split('/')[3],
      disabled: true,
      arr: [],
      varArr: [],
      att: [],
      attArr: [],
      disabledRemove: false,
      variationBtnDisabled: true,
      clickedProduct: null,
      imageIndex: 0,
    };
  }

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

  // Remove style from selected attribute
  removeColor = () => {
    const colorList = document.querySelectorAll('.selectedColor');
    colorList.forEach((item) => item.classList.remove('selectedColor'));
  };

  // Add Remove style to selected attribute
  addColor = (e) => {
    e.target.classList.add('selectedColor');
  };

  // Remove attribute
  removeAttribute = (attribute) => {
    let className = `selected${attribute}`;
    let modClassName = className.split(' ').join('');
    const sizeList = document.querySelectorAll(`.${modClassName}`);
    sizeList.forEach((item) => item.classList.remove(`${modClassName}`));
  };

  // Add attribute
  addAttribute = (e, attribute) => {
    this.setState({ att: [...this.state.att, attribute] });
    let className = `selected${attribute}`;
    let modClassName = className.split(' ').join('');
    e.target.classList.add(`${modClassName}`);
  };

  // Select attribute(s)
  selectAttribute = (product, e, attribute, type) => {
    // While selecting attributes from PDP
    if (type === 'default') {
      this.removeAttribute(attribute);
      this.addAttribute(e, attribute);
      this.setState({
        arr: [...this.state.arr, { [attribute]: e.target.innerText }],
      });

      if (product.attributes.length === this.state.arr.length + 1) {
        this.setState({ disabled: false });
      }
    } else {
      // While selecting attributes from variation page
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

  // Seletc Color Type
  selectColor = (product, e, value, type) => {
    // While selecting attributes from PDP
    if (type === 'default') {
      this.removeColor();
      this.addColor(e);
      this.setState({
        arr: [...this.state.arr, { color: value }],
      });

      if (product.attributes.length === this.state.arr.length + 1) {
        this.setState({ disabled: false });
      }
    } else {
      // While selecting attributes from variation page
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

  // Add product to cart
  addToCart = (product, e) => {
    // If product has no attribute
    if (product.attributes.length === 0) {
      this.context.cartDispatch(
        addProduct({
          product: product,
          price: product.prices[0].amount,
          quantity: 1,
        })
      );
    } else {
      // If product has attribute(s)
      let newArr = this.state.arr.slice(-product.attributes.length);
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

  // Modify product quantity
  ProdhandleQuantity = (
    singleProduct,
    type,
    ProductQuantity,
    quantityInCart,
    cart
  ) => {
    //  Decrease quantity
    if (type === 'dec') {
      if (quantityInCart > 0) {
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
    if (type === 'inc') {
      // If product has no attribute
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

        // this.context.cartDispatch(
        //   addProduct({
        //     product: singleProduct,
        //     price: singleProduct.prices[0].amount,
        //     quantity: 1,
        //   })
        // );
        this.setState({ disabledRemove: true }); //Disable button for X millisecond
        setTimeout(() => {
          this.setState({ disabledRemove: false });
        }, 500);
      } else {
        this.setState({ clickedProduct: singleProduct });
        let newArr = this.state.attArr.slice(-singleProduct.attributes.length);
        let cartProduct = { ...singleProduct, attributes: newArr };
        // this.context.quantityDispatch(increaseProductAmount());

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

  // show the variation overlay
  showOverlay = () => {
    document.body.style.overflow = 'hidden';
    const overlay = document.querySelector('.variationContainer');
    overlay.classList.add('show');
  };
  // show the variation overlay
  removeOverlay = () => {
    document.body.style.overflowY = 'scroll';
    const overlay = document.querySelector('.variationContainer');
    overlay.classList.remove('show');
  };

  // Set attributes of the selected product
  setVariation = (singleProduct) => {
    let newArr = this.state.varArr.slice(-singleProduct.attributes.length);
    let variedProduct = {
      ...singleProduct,
      attributes: newArr,
      idInCart:
        new Date().valueOf().toString(36) +
        Math.random().toString(36).substr(2),
    };

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

  getSmallImage = (e, singleImage) => {
    this.setState({
      imageIndex: this.state.product.gallery.indexOf(singleImage),
    });
  };

  render() {
    const { currency, baseConverter } = this.context.currencyState;
    const { cart } = this.context.cartState;
    const { ProductQuantity } = this.context.quantityState;
    const dispContentSet = new Set(cart);
    const dispContent = Array.from(dispContentSet);
    console.log(this.state.product);

    return (
      <>
        {this.state.product && (
          <div className="variationContainer">
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
                  <FontAwesomeIcon icon={faClose} className="closeIcon" />
                </span>
              </div>
              <div className="containerBottom">
                {this.state.product &&
                  this.state.product.attributes.length > 0 &&
                  this.state.product.attributes.map((attribute) => {
                    if (attribute.id === 'Color') {
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
                                      'variation'
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
                                    'variation'
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
                              {singleProduct.name.split(' ').slice(0, 1)}
                              <br />
                              <span>
                                {singleProduct.name
                                  .split(' ')
                                  .slice(1)
                                  .join(' ')}
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
                                    if (Object.keys(attribute)[0] === 'color') {
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
                                {this.state.clickedProduct === singleProduct ? (
                                  <button
                                    disabled={this.state.disabledRemove}
                                    className="variationAdd"
                                    onClick={() =>
                                      this.ProdhandleQuantity(
                                        singleProduct,
                                        'inc',
                                        ProductQuantity,

                                        cart.filter((v) => v === singleProduct)
                                          .length
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
                                        singleProduct,
                                        'inc',
                                        ProductQuantity,

                                        cart.filter((v) => v === singleProduct)
                                          .length
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
                                {this.state.clickedProduct === singleProduct ? (
                                  <button
                                    disabled={this.state.disabledRemove}
                                    className="variationRemove"
                                    onClick={() =>
                                      this.ProdhandleQuantity(
                                        singleProduct,
                                        'dec',
                                        ProductQuantity,

                                        cart.filter((v) => v === singleProduct)
                                          .length
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
                                        singleProduct,
                                        'dec',
                                        ProductQuantity,

                                        cart.filter((v) => v === singleProduct)
                                          .length
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
                      }
                    })
                  ) : (
                    <div className="miniCartTotal">Please select a product</div>
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
                  console.log(singleImage);
                  return (
                    <div
                      className="smallImage"
                      key={singleImage}
                      onClick={(e) => this.getSmallImage(e, singleImage)}
                    >
                      <img src={singleImage} alt="" key={singleImage} />
                    </div>
                  );
                })}
              </div>
              <div className="productContainerCenter">
                <div className="mainProductImg">
                  {/* <SimpleImageSlider
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
                  /> */}
                  <img
                    src={this.state.product.gallery[this.state.imageIndex]}
                    alt=""
                  />
                </div>
              </div>
              <div className="productContainerRight">
                <div className="productTitle">
                  {this.state.product.name.split(' ').slice(0, 1)}
                  <br />
                  <span>
                    {this.state.product.name.split(' ').slice(1).join(' ')}
                  </span>
                </div>
                <div className="productSizes">
                  <h5>Please select desired specification(s)</h5>
                  {this.state.product.attributes.length > 0 &&
                    this.state.product.attributes.map((attribute) => {
                      if (attribute.id === 'Color') {
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
                                        'default'
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
                                      'default'
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

                <div className="productBtn">
                  {this.state.product.attributes.length === 0 ? (
                    cart.some(
                      (cartItem) => cartItem.id === this.state.product.id
                    ) === true ? (
                      <div className="productQuantitySet">
                        <div
                          className="productPageAdd"
                          onClick={(e) =>
                            this.ProdhandleQuantity(
                              this.state.product,
                              'inc',
                              e,
                              ProductQuantity,
                              cart
                            )
                          }
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
                          onClick={(e) =>
                            this.ProdhandleQuantity(
                              this.state.product,
                              'dec',
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
                      <div
                        className="productPageAdd"
                        onClick={this.showOverlay}
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
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

