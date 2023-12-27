import PropTypes from "prop-types";
import React, { useEffect } from "react";
import logolight from "../../assets/images/logo-light.png";
import logodark from "../../assets/images/logo-dark.png";

import { Row, Col, Alert, Form, Input, FormFeedback, Label } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { getTenantId } from "../../store/actions";

const Login = props => {
  document.title = "Login | CYPROTECK - Security Solutions Dashboard";

  const dispatch = useDispatch();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
      dispatch(getTenantId(values.email.toLowerCase(), props.router.navigate));
    }
  });

  const { error } = useSelector(state => ({
    error: state.azure.error.message,
  }));

  // handleValidSubmit
  // const handleValidSubmit = (event, values) => {
  //   dispatch(loginUser(values, props.router.navigate));
  // };

  // const signIn = (res, type) => {
  //   if (type === "google" && res) {
  //     const postData = {
  //       name: res.profileObj.name,
  //       email: res.profileObj.email,
  //       token: res.tokenObj.access_token,
  //       idToken: res.tokenId,
  //     };
  //     dispatch(socialLogin(postData, props.router.navigate, type));
  //   } else if (type === "facebook" && res) {
  //     const postData = {
  //       name: res.name,
  //       email: res.email,
  //       token: res.accessToken,
  //       idToken: res.tokenId,
  //     };
  //     dispatch(socialLogin(postData, props.router.navigate, type));
  //   }
  // };

  //handleGoogleLoginResponse
  // const googleResponse = response => {
  //   signIn(response, "google");
  // };

  //handleTwitterLoginResponse
  // const twitterResponse = e => {}

  //handleFacebookLoginResponse
  // const facebookResponse = response => {
  //   signIn(response, "facebook");
  // };

  useEffect(() => {
    document.body.className = "bg-pattern";
    // remove classname when component will unmount
    return function cleanup() {
      document.body.className = "";
    };
  });

  return (
    <React.Fragment>
    <div className="account-pages my-0 pt-0 m-0 p-0">
        <div className="auth-mobile-container auth-container">
            <div className="left-auth-card left-auth-mobile-card text-center">
                    <Link to="/">
                      <img
                        src={logodark}
                        alt="CYPROTECK"
                        className="auth-logo logo-dark mx-auto"
                      />
                      <img
                        src={logolight}
                        alt="CYPROTECK"
                        className="auth-logo logo-light mx-auto"
                      />
                    </Link>
                  <div className="auth-left-footer">
                    <Link
                      target="_blank"
                      to="https://cyproteck.com/buynow/"
                      className="text-dark"
                    >
                      Don't have an account? Register
                    </Link>
                  </div>
            </div>
            <div className="right-auth-card right-auth-mobile-card">
                  <h6 className="font-size-18 text-info" style={{marginTop: "50px", fontWeight: 800}}>
                    Welcome Back,
                  </h6>
                  <h6 className="font-size-18 text-info" style={{fontWeight: 800, marginBottom: "50px"}}>
                    Log in continue.
                  </h6>
                  <Form
                    className="form-horizontal"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    {error ? <Alert color="danger"><div>{error}</div></Alert> : null}
                    <Row>
                      <Col md={12}>
                        <div className="mb-4">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="email@example.com"
                          type="email"
                          style={{backgroundColor: 'white', borderRadius: '15px'}}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                        ) : null}
                        </div>

                        
                        <div className="d-grid mt-4">
                          <button
                            className="btn btn-info waves-effect waves-light"
                            style={{borderRadius: '15px'}}
                            type="submit"
                          >
                            Login <i className="mdi mdi-login"></i>
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                  <div className="right-auth-footer">
                    <Link
                      to="https://cyproteck.com/?page_id=1087"
                      target="_blank"
                      className="text-light"
                    >
                      Need help? Contact Support <i className="mdi mdi-face-agent"></i> 
                    </Link>
                  </div>
            </div>
        </div>
    </div>
  </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
