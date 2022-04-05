import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import GlobalContextProvider from "./context/Provider/Provider";
import { GlobalContextProvider } from "./context/Provider/Provider";

ReactDOM.render(
  <React.StrictMode>
    <GlobalContextProvider>
      <App />
    </GlobalContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

