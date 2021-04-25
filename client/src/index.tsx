import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "@material/react-switch/dist/switch.css";
import App from "./App";
import { API } from "./api";
import * as sw from "./serviceWorkerRegistration";
// import reportWebVitals from "./reportWebVitals";

if (window.location && window.location.origin === "https://shindig.one") {
  API.init("https://api.shindig.one");
} else {
  API.init("https://dev-api.shindig.one");
}

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
