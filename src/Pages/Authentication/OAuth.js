import React, { useEffect } from "react";
import logolight from "../../assets/images/logo-light.png";
import logodark from "../../assets/images/logo-dark.png";

import { Container, Row, Col, Card, CardBody, Form } from "reactstrap";
import { Link } from "react-router-dom";

// import

const OAuth = () => {
  document.title = "OAuth | Upzet - React Admin & Dashboard Template";
    useEffect(() => {
        document.body.className = "bg-pattern";
        // remove classname when component will unmount
        return function cleanup() {
          document.body.className = "";
        };
      });
  return (
    <React.Fragment>
      <div className="bg-overlay"></div>
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8} xl={4}>
              <Card>
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
                    <h4 className="font-size-18 text-muted mt-2 text-center">
                      Welcome Back !
                    </h4>
                    <p className="mb-5 text-center">
                      Please login using your Microsoft Organization account in the popup. You will be redirected automatically.
                    </p>
                    <Form className="form-horizontal" action="#">
                      <Row>
                        <Col md={12}>

                          <div className="d-grid mt-4">
                            <button
                              className="btn btn-danger waves-effect waves-light"
                              type="submit"
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
                  Don't have an account ?{" "}
                  <Link to="/auth-register" className="fw-medium text-primary">
                    {" "}
                    Register{" "}
                  </Link>{" "}
                </p>
                <p className="text-white-50">
                  © {new Date().getFullYear()} Upzet. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger"></i> by Themesdesign
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default OAuth;
