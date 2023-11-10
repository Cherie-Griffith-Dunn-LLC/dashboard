import React, { useEffect } from "react";
import logolight from "../../assets/images/logo-light.png";
import logodark from "../../assets/images/logo-dark.png";

import { Container, Row, Col, Card, CardBody, Form } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// import msal
import { InteractionRequiredAuthError, PublicClientApplication } from "@azure/msal-browser";

import { setAuthorization } from "../../helpers/api_helper"; 

const OAuth = props => {
  

  document.title = "OAuth | CYPROTECK - Security Solutions Dashboard";
    useEffect(() => {
        login();
        document.body.className = "bg-pattern";
        // remove classname when component will unmount
        return function cleanup() {
          document.body.className = "";
        };
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
        };
        const msalInstance = new PublicClientApplication(msalConfig);
        await msalInstance.initialize();

        const request ={ 
          scopes: [
          'openid',
          'offline_access',
          'Directory.Read.All',
          'User.Read.All'
          ]
        };

        // login the user
        msalInstance.acquireTokenSilent(request).then(tokenResponse => {
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
          if (error instanceof InteractionRequiredAuthError) {
            return msalInstance.acquireTokenPopup(request).then(tokenResponse => {
              // get access token
              const accessToken = tokenResponse.accessToken;
              const expiresOn = tokenResponse.expiresOn / 1000;
              // store the accesstoken securely
              localStorage.setItem("accessToken", accessToken);
              // store the expireTime
              localStorage.setItem("expireTime", expiresOn);
              // set Authorization to the accesstoken
              setAuthorization(accessToken);
              // redirect to dashboard
              props.router.navigate("/dashboard");
            });
          } else {
            console.error(error);
            // use acquireTokenPopup to authenticate user silently
            return msalInstance.acquireTokenPopup(request).then(tokenResponse => {
              // get access token
              const accessToken = tokenResponse.accessToken;
              // store the accesstoken securely
              localStorage.setItem("accessToken", accessToken);
              const expiresOn = tokenResponse.expiresOn / 1000;
              localStorage.setItem("expireTime", expiresOn);
              // set Authorization to the accesstoken
              setAuthorization(accessToken);
              // redirect to dashboard
              props.router.navigate("/dashboard");
            });
          }
        })
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
                    <p className="mb-5 text-center text-light">
                      Please login using your Microsoft Organization account in the popup. You will be redirected automatically. If you do not see a popup, ensure your browser is not blocking popups.
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
