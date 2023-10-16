import React from "react";
import { Navigate, Route } from "react-router-dom";

import { useProfile } from "../Hooks/UserHooks";

const AuthProtected = (props) => {
  const { userProfile, loading } = useProfile();
  // get the authToken and expiretime from localstorage
  const authToken = localStorage.getItem("accessToken");
  const expireTime = localStorage.getItem("expireTime");
  console.log("Expire Time", expireTime);
  console.log("Current Time", Math.floor(Date.now() / 1000));
  console.log(expireTime < Math.floor(Date.now() / 1000))


  // check if authToken exist and expireTime is valid
  if (!authToken) {
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  } else if (expireTime < Math.floor(Date.now() / 1000)) {
    // delete the authToken and expireTime if expired
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expireTime");
    localStorage.removeItem("authUser");
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };
