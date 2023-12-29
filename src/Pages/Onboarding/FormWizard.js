import React, { useState } from "react";

import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  TabContent,
  TabPane,
  Progress,
  NavLink,
  NavItem,
} from "reactstrap";

import classnames from "classnames";
import { Link } from "react-router-dom";


const FormWizard = () => {
  const [activeTab, setactiveTab] = useState(1);
  const [activeTabwiz, setoggleTabwiz] = useState(1);

  const [passedSteps, setPassedSteps] = useState([1]);
  const [passedStepswiz, setpassedStepswiz] = useState([1]);


  function toggleTabwiz(tab) {
    if (activeTabwiz !== tab) {
      var modifiedSteps = [...passedStepswiz, tab];
      if (tab >= 1 && tab <= 4) {
        setoggleTabwiz(tab);
        setpassedStepswiz(modifiedSteps);
      }
    }
  }

  return (
    <React.Fragment>
        <Container fluid={true}>

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">First Time Setup</h4>
                  <div id="progrss-wizard" className="twitter-bs-wizard">
                    <ul className="twitter-bs-wizard-nav nav-justified nav nav-pills">
                      <NavItem
                        className={classnames({
                          active: activeTabwiz === 1,
                        })}
                      >
                        <NavLink
                          className={
                            (classnames({
                              active: activeTabwiz === 1,
                            }))
                          }
                          onClick={() => {
                            toggleTabwiz(1);
                          }}
                        >
                          <span className="step-number">01</span>
                          <span className="step-title" style={{ paddingLeft: "10px" }}>Connect</span>
                        </NavLink>
                      </NavItem>
                      <NavItem
                        className={classnames({
                          active: activeTabwiz === 2,
                        })}
                      >
                        <NavLink
                          className={
                            (classnames({
                              active: activeTabwiz === 2,
                            }))
                          }
                          onClick={() => {
                            toggleTabwiz(2);
                          }}
                        >
                          <span className="step-number">02</span>
                          <span className="step-title" style={{ paddingLeft: "10px" }}>Import Users</span>
                        </NavLink>
                      </NavItem>

                      <NavItem
                        className={classnames({
                          active: activeTabwiz === 3,
                        })}
                      >
                        <NavLink
                          className={
                            (classnames({
                              active: activeTabwiz === 3,
                            }))
                          }
                          onClick={() => {
                            toggleTabwiz(3);
                          }}
                        >
                          <span className="step-number">03</span>
                          <span className="step-title" style={{ paddingLeft: "10px" }}>Notifications</span>
                        </NavLink>
                      </NavItem>

                      <NavItem
                        className={classnames({
                          active: activeTabwiz === 4,
                        })}
                      >
                        <NavLink
                          className={
                            (classnames({
                              active: activeTabwiz === 4,
                            }))
                          }
                          onClick={() => {
                            toggleTabwiz(4);
                          }}
                        >
                          <span className="step-number">04</span>
                          <span className="step-title" style={{ paddingLeft: "10px" }}>Confirm Details</span>
                        </NavLink>
                      </NavItem>
                    </ul>
                    <div id="bar" className="mt-4">
                      <div className="mb-4">
                        <Progress
                          value={25 * activeTabwiz}
                          color="success"
                          animated
                        ></Progress>
                      </div>
                    </div>

                    <TabContent activeTab={activeTabwiz} className="twitter-bs-wizard-tab-content">
                      <TabPane tabId={1}>
                        <div className="text-center">
                          <p className="text-secondary">Authorize CYPROTECK to read data from your organization's domain. Please select the platform your Active Directory is on.</p>
                          <Row>
                            <Col lg="6">
                              <div className="mt-4">
                                <Link to="#" className="btn btn-primary w-md">
                                  <i className="mdi mdi-google"></i> Google
                                </Link>
                              </div>
                            </Col>
                            <Col lg="6">
                              <div className="mt-4">
                                <Link to="#" className="btn btn-primary w-md">
                                  <i className="mdi mdi-microsoft"></i> Microsoft
                                </Link>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </TabPane>
                      <TabPane tabId={2}>
                        <div>
                          <Form>
                            <Row>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-pancard-input52">
                                    PAN Card
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-pancard-input52"
                                    placeholder="Enter Your PAN Card No."
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-vatno-input62">
                                    VAT/TIN No.
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-vatno-input62"
                                    placeholder="Enter Your VAT/TIN No."
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-cstno-input72">
                                    CST No.
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-cstno-input72"
                                    placeholder="Enter Your CST No."
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-servicetax-input82">
                                    Service Tax No.
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-servicetax-input82"
                                    placeholder="Enter Your Service Tax No."
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-companyuin-input92">
                                    Company UIN
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-companyuin-input92"
                                    placeholder="Company UIN No."
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-declaration-input102">
                                    Declaration
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-Declaration-input102"
                                    placeholder="Declaration Details"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </TabPane>
                      <TabPane tabId={3}>
                        <div>
                          <Form>
                            <Row>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-namecard-input112">
                                    Name on Card
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-namecard-input112"
                                    placeholder="Enter Your Name on Card"
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label>Credit Card Type</Label>
                                  <select className="form-select">
                                    <option>Select Card Type</option>
                                    <option>American Express</option>
                                    <option>Visa</option>
                                    <option>MasterCard</option>
                                    <option>Discover</option>
                                  </select>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-cardno-input122">
                                    Credit Card Number
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-cardno-input122"
                                    placeholder="Enter Your Card Number"
                                  />
                                </FormGroup>
                              </Col>

                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-card-verification-input">
                                    Card Verification Number
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-card-verification-input"
                                    placeholder="Card Verification Number"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <FormGroup className="mb-3">
                                  <Label htmlFor="basicpill-expiration-input132">
                                    Expiration Date
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-expiration-input132"
                                    placeholder="Card Expiration Date"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </TabPane>
                      <TabPane tabId={4}>
                        <div className="row justify-content-center">
                          <Col lg="12">
                            <div className="text-center">
                              <div className="mb-4">
                                <i className="mdi mdi-check-circle-outline text-success display-4" />
                              </div>
                              <div>
                                <h5>Confirm Detail</h5>
                                <p className="text-muted">
                                  If several languages coalesce, the grammar
                                  of the resulting
                                </p>
                              </div>
                            </div>
                          </Col>
                        </div>
                      </TabPane>
                    </TabContent>

                    <ul className="pager wizard twitter-bs-wizard-pager-link">
                      <li
                        className={
                          activeTabwiz === 1
                            ? "previous disabled me-2"
                            : "previous me-2"
                        }
                      >
                        <Link
                          to="#"
                          onClick={() => {
                            toggleTabwiz(activeTabwiz - 1);
                          }}
                        >
                          Previous
                        </Link>
                      </li>
                      <li
                        className={
                          activeTabwiz === 4 ? "next disabled" : "next"
                        }
                      >
                        <Link
                          to="#"
                          onClick={() => {
                            toggleTabwiz(activeTabwiz + 1);
                          }}
                        >
                          Next
                        </Link>
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
    </React.Fragment>
  );
};

export default FormWizard;
