const CurrencyReducer = (state, action) => {
  switch (action.type) {
    // CURRENCY REDUCER
    case "TO_USD":
      return {
        // category: state.category,
        currency: "$",
        baseConverter: Number("1"),
      };
    case "TO_POUNDS":
      return {
        // category: state.category,
        currency: "£",
        baseConverter: Number("0.866671"),
      };
    case "TO_CAD":
      return {
        // category: state.category,
        currency: "A$",
        baseConverter: Number("1.555409"),
      };
    case "TO_JPY":
      return {
        // category: state.category,
        currency: "¥",
        baseConverter: Number("130.210363"),
      };
    case "TO_RUB":
      return {
        // category: state.category,
        currency: "₽",
        baseConverter: Number("91.181299"),
      };

    //

    default:
      return { ...state };
  }
};

export default CurrencyReducer;
