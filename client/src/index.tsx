import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { API } from "./api";
import * as sw from "./serviceWorkerRegistration";
// import reportWebVitals from "./reportWebVitals";

API.init("https://shindig-app.herokuapp.com/");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

sw.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
