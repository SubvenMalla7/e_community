import React from "react";
import { Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Profile from "./screen/profile/Profile"
import Blog from "./screen/Blog";
import Login from "./screen/Login/login";
import SignUp from "./screen/signup/signup";
import { AuthProvider } from "./Auth";
import ProtectedRoute from "./protected.route";
import ChatDashboard from "./screen/Chat/chatDashboard";
import MobileChat from "./screen/Chat/mobilechat/mobileChatDashBoard";
import MobileChatView from "./screen/Chat/mobilechat/mobileChatView";
import MobCalender from "./screen/mobCalender";
import mobNotification from "./screen/mobNotification";

const useStyles = makeStyles({});
const firebase = require("firebase");
export default function App() {
  const classes = useStyles();
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // store the user on local storage
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // removes the user from local storage on logOut
      localStorage.removeItem('user');
    }
  })
  return (

    <div className={classes.container}>
      <AuthProvider>
        <Switch>

          <ProtectedRoute exact from="/blog" component={Blog} />
          <Route exact from="/" component={Login} />
          <Route exact from="/signup" component={SignUp} />
          <ProtectedRoute exact from="/message" component={ChatDashboard} />
          <ProtectedRoute exact path="/mobMessage" component={MobileChat} />
          <ProtectedRoute exact path="/mobileChatView" component={MobileChatView} />
          <ProtectedRoute exact path="/mobileNotification" component={mobNotification} />
          <ProtectedRoute exact path="/mobileCalender" component={MobCalender} />
          <ProtectedRoute exact path="/profile" component={Profile} />
        </Switch>
      </AuthProvider>
    </div>
  );
}
