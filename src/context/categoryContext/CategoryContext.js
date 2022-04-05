const a = localStorage.getItem("cat");

const CAT_INITIAL_STATE = {
  category: a || "all",
};
export default CAT_INITIAL_STATE;
