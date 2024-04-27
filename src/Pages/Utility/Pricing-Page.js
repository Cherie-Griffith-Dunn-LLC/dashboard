import React from "react";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

import { getPackages } from "../../store/actions";

import { useSelector, useDispatch } from "react-redux";

const PricingData = [
  
  {
    title: "Starter",
    caption: "Neque quis est",
    icon: "fas fa-cube",
    price: "19",
    isChild: [
      { id: "1", features: "Free Live Support" },
      { id: "2", features: "Unlimited User" },
      { id: "3", features: "No Time Tracking" },
      { id: "4", features: "Free Setup" },
    ],
  },
  {
    title: "Professional",
    caption: "Quis autem iure",
    icon: "fas fa-trophy",
    price: "29",
    isChild: [
      { id: "1", features: "Free Live Support" },
      { id: "2", features: "Unlimited User" },
      { id: "3", features: "No Time Tracking" },
      { id: "4", features: "Free Setup" },
    ],
  },
  {
    title: "Enterprise",
    caption: "Sed neque unde",
    icon: "fas fa-shield-alt",
    price: "39",
    isChild: [
      { id: "1", features: "Free Live Support" },
      { id: "2", features: "Unlimited User" },
      { id: "3", features: "No Time Tracking" },
      { id: "4", features: "Free Setup" },
    ],
  },
  {
    title: "Unlimited",
    caption: "Itque eam rerum",
    icon: "fas fa-headset",
    price: "49",
    isChild: [
      { id: "1", features: "Free Live Support" },
      { id: "2", features: "Unlimited User" },
      { id: "3", features: "No Time Tracking" },
      { id: "4", features: "Free Setup" },
    ],
  },
];

const installInstructions = {
  "windows": [
    { id: "1", features: "Download Installer" },
    { id: "2", features: "Right Click and Open the Installer" },
    { id: "3", features: "Enter Your E-Mail" },
    { id: "4", features: "Restart Computer" },
  ],
  "macos": [
    { id: "1", features: "Download Installer" },
    { id: "2", features: "Open 'Terminal' App" },
    { id: "3", features: "Drag the installer into the 'Terminal' Window and press Enter" },
    { id: "4", features: "Restart Computer" },
  ],
  "linux": [
    { id: "1", features: "Download Installer" },
    { id: "2", features: "Right Click and Open the Installer" },
    { id: "3", features: "Enter Your E-Mail" },
    { id: "4", features: "Restart Computer" },
  ],
};

const Pricing = () => {
  document.title = "Packages | CYPROTECK - Security Solutions Dashboard";

  //const role = localStorage.getItem('role');

  const dispatch = useDispatch();
  // dispatch getAlarms and return the alarms
  const { packages } = useSelector(state => ({
    packages: state.alienPackages.packages,
  }));
  const { loading } = useSelector(state => ({
      loading: state.alienPackages.loading,
  }));
  const { error } = useSelector(state => ({
      error: state.alienPackages.error,
  }));

  React.useEffect(() => {
    dispatch(getPackages());
    
  }, [dispatch]);


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Packages" />

          {(loading) ? <p>Loading...</p> : error ? <div className="alert alert-danger mb-4" role="alert">An error occured. Please try again.</div> :
            <>
            <Row className="justify-content-center">
            <Col lg={5}>
              <div className="text-center mb-5">
                <h4>Download CYPROTECK for your device</h4>
                <p className="text-muted">
                  Select the package that matches your device's operating system. For more information, please visit our <Link to="https://cyproteck.com/?page_id=1087" target="_BLANK" className="text-primary">FAQ</Link> page.
                </p>
              </div>
            </Col>
          </Row>

          <Row>
            {packages.map((item, key) => (
              <Col xl={3} md={60} key={key}>
                <Card>
                  <CardBody className="p-4">
                    <div className="d-flex mb-1">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <span className="avatar-title rounded-circle bg-primary">
                            <i className={item?.platform == "windows" ? "fab fa-windows font-size-20" : item?.platform == "macos" ? "fab fa-apple font-size-20" : item?.platform == "linux" ? "fab fa-linux font-size-20" : "fas fa-shield-alt font-size-20"}></i>
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="font-size-16">{item?.platform.toUpperCase()}</h5>
                        <p className="text-muted text-wrap" style={{width: "8rem"}}>{item?.filename}</p>
                      </div>
                    </div>
                    <div className="py-4 border-bottom">
                      <div className="float-end plan-btn">
                        <Link
                          to={item?.download_link}
                          className="btn btn-primary btn-sm waves-effect waves-light"

                        >
                          Download Now
                        </Link>
                      </div>
                      <h4>
                        Latest
                      </h4>
                    </div>
                    <div className="plan-features mt-4">
                      <h5 className="text-center font-size-15 mb-4">
                        Installation Steps :
                      </h5>
                      {installInstructions[item?.platform].map((subitem, key) => (
                        <p key={key}>
                          <i className="mdi mdi-checkbox-marked-circle-outline font-size-16 align-middle text-primary me-2"></i>{" "}
                          {subitem?.features}
                        </p>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
            </>
          }
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Pricing;
