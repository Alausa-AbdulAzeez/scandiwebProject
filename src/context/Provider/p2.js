export default class Provider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryState: "ALL",
      currencyState: {
        category: "ALL",
        currency: "$",
        baseConverter: Number("1"),
      },
      cartState: {
        cart: [],
        quantity: 0,
        total: 0,
      },
      quantityState: 1,
    };
  }

  render() {
    const { categoryState, currencyState, cartState, quantityState } =
      this.state;
    return (
      <GlobalContext.Provider
        value={{
          categoryState,
          CategoryReducer,
          currencyState,
          CurrencyReducer,
          cartState,
          CartReducer,
          quantityState,
          QuantityReducer,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}
