import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import '../src/index.css'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import CssBaseline from "@material-ui/core/CssBaseline";

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyAGUGHAmOtQjyRYm4XojMn4C3pkpKRsrHg",
  authDomain: "community-e.firebaseapp.com",
  databaseURL: "https://community-e.firebaseio.com",
  projectId: "community-e",
  storageBucket: "community-e.appspot.com",
  messagingSenderId: "224535331646",
  appId: "1:224535331646:web:b01284dd12b74f6a32e26f",
  measurementId: "G-92J2EMY595"
});
const theme = createMuiTheme({
  palette: {
    
    primary:{
      main:"#ff914d"
    },
    
  }
});
const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <App />
      </Router>
    </MuiThemeProvider>
  </React.StrictMode>,
  rootElement
);
