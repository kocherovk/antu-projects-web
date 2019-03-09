import './index.scss';

import ReactDOM from "react-dom";
import React from "react";

import App from "./components/App"

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

ReactDOM.render(<App />, document.getElementById("index"));