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

const useStyles = makeStyles({});

export default function App() {
  const classes = useStyles();
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
          <ProtectedRoute exact path="/profile" component={Profile} />
        </Switch>
      </AuthProvider>
    </div>
  );
}
