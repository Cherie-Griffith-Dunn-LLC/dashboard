import React, { useEffect } from "react";
import logolight from "../../assets/images/logo-light.png";
import logodark from "../../assets/images/logo-dark.png";

import { Container, Row, Col, Card, CardBody, Form } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// import msal
import { PublicClientApplication, InteractionType, BrowserAuthError } from "@azure/msal-browser";

// import google oauth
import { useGoogleLogin  } from "@react-oauth/google";

import { setAuthorization } from "../../helpers/api_helper"; 

import { useSelector } from "react-redux";

const OAuth = props => {
  const platform = useSelector(state => state.azure.tenantId?.platform);
  const email = useSelector(state => state.azure.tenantId?.email);
  const onboarded = useSelector(state => state.azure.tenantId?.onboarded);

  // create a state for error
  const [error, setError] = React.useState(null);

  document.title = "OAuth | CYPROTECK - Security Solutions Dashboard";
    useEffect(() => {
      console.log("platform", platform);
      localStorage.setItem("platform", platform);
        if (platform === "azure") {
          login();
        }
        document.body.className = "bg-pattern";
        // remove classname when component will unmount
        return function cleanup() {
          document.body.className = "";
        };
      });

      //Google config
      const googleConfig = {
        clientId: '569515826831-u7i0hq4iigjt0rik54mosc8s6rp0qkg3.apps.googleusercontent.com',
        redirectUri: 'http://localhost/',
        scope: 'openid profile email https://www.googleapis.com/auth/admin.directory.user.readonly https://www.googleapis.com/auth/admin.directory.rolemanagement.readonly https://www.googleapis.com/auth/admin.directory.domain.readonly https://www.googleapis.com/auth/admin.directory.group.readonly'
      };

      // handle google login
      const handleGoogleLogin = async (response) => {
        const accessToken = response.access_token;
        const expiresIn = response.expires_in;
        // create our own expire time
        const expiresOn = new Date();
        expiresOn.setSeconds(expiresOn.getSeconds() + expiresIn);
        // store the accesstoken securely
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("expireTime", expiresOn);
        // set Authorization to the accesstoken
        setAuthorization(accessToken);
        // redirect to dashboard
        props.router.navigate("/dashboard");

      }

      const gLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => handleGoogleLogin(tokenResponse),
        onError: (error) => console.error(error),
        prompt: onboarded === 0 ? 'consent' : 'select_account',
        clientId: googleConfig.clientId,
        redirectUri: googleConfig.redirectUri,
        scope: googleConfig.scope,
        hint: email,
        flow: 'implicit'
      });

      // msal function
      const login = async () => {
        // initialize msal
        const msalConfig = {
          auth: {
            clientId: "1d40f6b3-9072-4a0a-af48-6e423e58d0d6",
            // Set the authority to our tenant ID passed in from props
            authority: `https://login.microsoftonline.com/` + props.router.params.tenantId,
            // set redirect based on production env
            redirectUri: "/",
          },
          interactionType: InteractionType.Popup,
          prompt: "select_account",
          extraQueryParameters: {
            login_hint: email
          },
          scopes: [
            'openid',
            'offline_access',
            'Directory.Read.All',
            'User.Read.All'
            ]
        };


        const msalInstance = new PublicClientApplication(msalConfig);
        await msalInstance.initialize();

        // login the user
        msalInstance.acquireTokenPopup(msalConfig).then(tokenResponse => {
          // get access token
          const accessToken = tokenResponse.accessToken;
          const expiresOn = tokenResponse.expiresOn / 1000;
          localStorage.setItem("expireTime", expiresOn);
          // store the accesstoken securely
          localStorage.setItem("accessToken", accessToken);
          // set Authorization to the accesstoken
          setAuthorization(accessToken);
          // redirect to dashboard
          props.router.navigate("/dashboard");
        }).catch(error => {
          console.log("caught error",error);
           if (error instanceof BrowserAuthError) {
            if (error.errorCode === "popup_window_error") {
              setError("Popup window error. Please ensure your browser is not blocking popups.");
            } else {
              setError("An error occurred with your browser. Please try again.");
            }
          } else {
            setError("An error occurred. Please try again.");
          }
        })
      }

  if (platform === "google") {
    return (
      <React.Fragment>
      <div className="bg-overlay"></div>
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8} xl={4}>
              <Card className="right-auth-card">
                <CardBody className="p-4">
                  <div>
                    <div className="text-center">
                      <Link to="/">
                        <img
                          src={logodark}
                          alt=""
                          height="24"
                          className="auth-logo logo-dark mx-auto"
                        />
                        <img
                          src={logolight}
                          alt=""
                          height="24"
                          className="auth-logo logo-light mx-auto"
                        />
                      </Link>
                    </div>
                    <h4 className="font-size-18 text-light mt-2 text-center">
                      Welcome Back !
                    </h4>
                    {error && (
                      <p className="mb-5 text-center text-light">
                        {error}
                      </p>
                    )}
                    <p className="mb-5 text-center text-light">
                      Please login using your Google Organization account in the popup. You will be redirected automatically. If you do not see a popup, ensure your browser is not blocking popups.
                    </p>
                    <Form className="form-horizontal" action="#">
                      <Row>
                        <Col md={12}>
                          <div className="d-grid mt-4">
                          <button
                                className="btn btn-primary waves-effect waves-light"
                                type="reset"
                                onClick={() => gLogin()}
                              >Continue with Google</button>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>

                          <div className="d-grid mt-4">
                            <button
                              className="btn btn-danger waves-effect waves-light"
                              type="submit"
                              onClick={() => props.router.navigate("/login")}
                            >
                              Cancel
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p className="text-white-50">
                  Having trouble logging in?{" "}
                  <Link to="https://cyproteck.com/?page_id=1087" target="_blank" className="fw-medium text-primary">
                    {" "}
                    Help Desk{" "}
                  </Link>{" "}
                </p>
                <p className="text-white-50">
                  © {new Date().getFullYear()} CYPROTECK, Inc.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <div className="bg-overlay"></div>
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8} xl={4}>
              <Card className="right-auth-card">
                <CardBody className="p-4">
                  <div>
                    <div className="text-center">
                      <Link to="/">
                        <img
                          src={logodark}
                          alt=""
                          height="24"
                          className="auth-logo logo-dark mx-auto"
                        />
                        <img
                          src={logolight}
                          alt=""
                          height="24"
                          className="auth-logo logo-light mx-auto"
                        />
                      </Link>
                    </div>
                    <h4 className="font-size-18 text-light mt-2 text-center">
                      Welcome Back !
                    </h4>
                    {error && (
                      <p className="mb-5 text-center text-light">
                        {error}
                      </p>
                    )}
                    <p className="mb-5 text-center text-light">
                      Please login using your {platform?.toUpperCase()} Organization account in the popup. You will be redirected automatically. If you do not see a popup, ensure your browser is not blocking popups.
                    </p>
                    <Form className="form-horizontal" action="#">
                      <Row>
                        <Col md={12}>

                          <div className="d-grid mt-4">
                            <button
                              className="btn btn-danger waves-effect waves-light"
                              type="submit"
                              onClick={() => props.router.navigate("/login")}
                            >
                              Cancel
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p className="text-white-50">
                  Having trouble logging in?{" "}
                  <Link to="https://cyproteck.com/?page_id=1087" target="_blank" className="fw-medium text-primary">
                    {" "}
                    Help Desk{" "}
                  </Link>{" "}
                </p>
                <p className="text-white-50">
                  © {new Date().getFullYear()} CYPROTECK, Inc.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(OAuth);
