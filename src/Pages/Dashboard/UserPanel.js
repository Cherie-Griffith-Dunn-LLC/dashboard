import React, { useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { getRiskScore } from "../../helpers/data_helper";
import { useSelector, useDispatch } from 'react-redux';
import { getRequiredCourses } from '../../store/actions';

// import RadialChart1 from "./userpanelChart1";
// import RadialChart2 from "./userpanelChart2";
// import RadialChart3 from "./userpanelChart3";

const UserPanel = (props) => {

  const events = props.events;
  const alarms = props.alarms;
  const dwmAlarms = props.dwm;
  const mobileThreats = props.mobileThreats;
  const role = props.role;
  const courseStats = props.courseStats;
  const assignments = useSelector(state => state.lmsAssignedCourses);

  const [riskScore, setRiskScore] = useState(0);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (role === "admin") {
      setRiskScore(
        getRiskScore(
          alarms?.alarms.page?.totalElements,
          dwmAlarms?.alarms.page?.totalElements,
          courseStats?.statistics?.totalInProgressCourses
          )
        );
    }
  }, [role, alarms, dwmAlarms, courseStats, setRiskScore]);

  React.useEffect(() => {
    if (role === "user") {
      dispatch(getRequiredCourses());
    }
  }, [dispatch, role]);


  // admin panel

  if (role === "admin") {
    return (
      <React.Fragment>
        <Row>
          <Col xl={3} sm={6}>
            <Card>
              <CardBody>
                <div className="d-flex text-muted">
                  <div className="flex-shrink-0 me-3 align-self-center">
                    <div className="avatar-sm">
                      <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                        <i className="mdi mdi-biohazard"></i>
                      </div>
                    </div>
                  </div>
  
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="mb-1">Threats</p>
                    {alarms.loading !== false ? (
                      <h5 className="mb-3 placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </h5>
                    ) : (
                      <h5 className="mb-3">{alarms?.alarms.page?.totalElements}</h5>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
  
          <Col xl={3} sm={6}>
            <Card>
              <CardBody>
                <div className="d-flex">
                  <div className="flex-shrink-0 me-3 align-self-center">
                    <div className="avatar-sm">
                      <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                        <i className="mdi mdi-cellphone-lock"></i>
                      </div>
                    </div>
                  </div>
  
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="mb-1">Mobile Security</p>
                    {mobileThreats.loading !== false ? (
                      <h5 className="mb-3 placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </h5>
                    ) : (<h5 className="mb-3">
                      {mobileThreats?.threats?.count >= 10000 ? "10k" : mobileThreats?.threats?.count}
                    </h5>)}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
  
          <Col xl={3} sm={6}>
            <Card>
              <CardBody>
                <div className="d-flex text-muted">
                  <div className="flex-shrink-0 me-3 align-self-center">
                    <div className="avatar-sm">
                      <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                        <i className="mdi mdi-form-textbox-password"></i>
                      </div>
                    </div>
                  </div>
  
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="mb-1">Dark Web</p>
                    {dwmAlarms.loading !== false ? (
                      <h5 className="mb-3 placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </h5>
                    ) : (<h5 className="mb-3">{dwmAlarms?.alarms.page?.totalElements}</h5>)}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
  
          <Col xl={3} sm={6}>
            <Card>
              <CardBody>
                <div className="d-flex text-muted">
                  <div className="flex-shrink-0 me-3 align-self-center">
                    <div className="avatar-sm">
                      <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                        <i className="mdi mdi-gauge"></i>
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="mb-1">Risk Score</p>
                    {(dwmAlarms.loading || alarms.loading) ? (
                      <h5 className="mb-3 placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </h5>
                    ) : (<h5 className="mb-3">{riskScore}</h5>)}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  // user panel

  return (
    <React.Fragment>
      <Row>
        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div className="avatar-sm">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="mdi mdi-biohazard"></i>
                    </div>
                  </div>
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Threats</p>
                  {alarms.loading !== false ? (
                    <h5 className="mb-3 placeholder-glow">
                        <span className="placeholder col-6"></span>
                      </h5>
                  ) : (<h5 className="mb-3">{alarms?.investigation.page?.totalElements}</h5>)}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className="d-flex">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div className="avatar-sm">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="mdi mdi-clipboard-pulse-outline"></i>
                    </div>
                  </div>
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <p className="mb-1">Course Assignments</p>
                  {assignments.loading !== false ? (
                    <h5 className="mb-3 placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </h5>
                  ) : (<h5 className="mb-3">{assignments.courses.length}</h5>)}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default UserPanel;
