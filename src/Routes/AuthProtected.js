import React from "react";
import { Navigate, Route } from "react-router-dom";
import { getCurrentUser, getCurrentRole } from "../store/actions";
import { useDispatch, useSelector } from "react-redux";

import { Container } from "reactstrap";

//import { useProfile } from "../Hooks/UserHooks";

const AuthProtected = (props) => {
  //const { userProfile, loading } = useProfile();
  // get the authToken and expiretime from localstorage
  const authToken = localStorage.getItem("accessToken");
  const expireTime = localStorage.getItem("expireTime");
  const authUser = localStorage.getItem("authUser");
  //const role = localStorage.getItem("role");

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!authUser) {
      dispatch(getCurrentUser());
      dispatch(getCurrentRole());
    }
  }, [dispatch, authUser]);

  const currentUser = useSelector(state => state.getCurrentUser);
  const currentRole = useSelector(state => state.getCurrentRole);


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
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    return (
      <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }

  // get the current user and store it
  if (!authUser) {
    if (currentUser.loading) {
      return (
        <React.Fragment>
          <div className="page-content">
            <Container fluid={true}>
              <p>Loading...</p>
            </Container>
          </div>
        </React.Fragment>
      )
    } else if (currentRole.loading) {
      return (
        <React.Fragment>
          <div className="page-content">
            <Container fluid={true}>
              <p>Loading...</p>
            </Container>
          </div>
        </React.Fragment>
      )
    } else {
      localStorage.setItem("authUser", JSON.stringify(currentUser.user));
      localStorage.setItem("role", currentRole.role);
    }
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
