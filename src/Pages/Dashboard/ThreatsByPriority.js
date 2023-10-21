import React from "react";
import RadialChart from "./RadialChart";

import { Card, CardBody, Col, Row } from "reactstrap";

// import { SocialSourceData } from "../../CommonData/Data/index";

const ThreatsByPriority = (props) => {
  const alarms = props.alarms?.alarms;
  const loading = props.alarms?.loading;
  const error = props.alarms?.error;
  // create a series in state
  const [series, setSeries] = React.useState([]);

  React.useEffect(() => {
    var low = 0;
    var high = 0;
    var medium = 0;
    if (!loading) {
      alarms._embedded.alarms.forEach((item) => {
        if (item.priority_label === "low") {
          low++;
        } else if (item.priority_label === "medium") {
          medium++;
        } else if (item.priority_label === "high") {
          high++;
        }
      });
    }
    setSeries([low, medium, high]);
  }
  , [alarms, loading]);

  if (error) {
    console.error(error);
  }
  if (loading !== false) {
    return (
      
    <React.Fragment>
    <Col xl={4}>
      <Card>
        <CardBody>
          <div className="d-flex  align-items-center">
            <div className="flex-grow-1">
              <h5 className="card-title">Threats by Priority</h5>
            </div>
            <div className="flex-shrink-0">
              <select className="form-select form-select-sm mb-0 my-n1">
                {[
                  "May",
                  "April",
                  "March",
                  "February",
                  "January",
                  "December",
                ].map((item, key) => (
                  <option key={key} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div>Loading...</div>
          </div>
          <Row>
              <div className="col-4">
                <div className="social-source text-center mt-3">
                  <div className="avatar-xs mx-auto mb-3">
                    <span
                      className="avatar-title rounded-circle font-size-18 bg-success"
                    >
                      <i className="mdi mdi-priority-low text-white"></i>
                    </span>
                  </div>
                  <h5 className="font-size-15">Low</h5>
                  <p className="text-muted mb-0">0 Alarms</p>
                </div>
              </div>
              <div className="col-4">
                <div className="social-source text-center mt-3">
                  <div className="avatar-xs mx-auto mb-3">
                    <span
                      className="avatar-title rounded-circle font-size-18 bg-warning"
                    >
                      <i className="mdi mdi-format-align-middle text-white"></i>
                    </span>
                  </div>
                  <h5 className="font-size-15">Medium</h5>
                  <p className="text-muted mb-0">0 Alarms</p>
                </div>
              </div>
              <div className="col-4">
                <div className="social-source text-center mt-3">
                  <div className="avatar-xs mx-auto mb-3">
                    <span
                      className="avatar-title rounded-circle font-size-18 bg-danger"
                    >
                      <i className="mdi mdi-priority-high text-white"></i>
                    </span>
                  </div>
                  <h5 className="font-size-15">High</h5>
                  <p className="text-muted mb-0">0 Alarms</p>
                </div>
              </div>
            </Row>
        </CardBody>
      </Card>
    </Col>
  </React.Fragment>
    );
  }


  return (
    <React.Fragment>
      <Col xl={4}>
        <Card>
          <CardBody>
            <div className="d-flex  align-items-center">
              <div className="flex-grow-1">
                <h5 className="card-title">Threats by Priority</h5>
              </div>
              <div className="flex-shrink-0">
                <select className="form-select form-select-sm mb-0 my-n1">
                  {[
                    "May",
                    "April",
                    "March",
                    "February",
                    "January",
                    "December",
                  ].map((item, key) => (
                    <option key={key} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* RadialChart */}
            <RadialChart alarms={props.alarms} series={series}  />
            <Row>
              <div className="col-4">
                <div className="social-source text-center mt-3">
                  <div className="avatar-xs mx-auto mb-3">
                    <span
                      className="avatar-title rounded-circle font-size-18 bg-success"
                    >
                      <i className="mdi mdi-priority-low text-white"></i>
                    </span>
                  </div>
                  <h5 className="font-size-15">Low</h5>
                  <p className="text-muted mb-0">{series[0]} Alarms</p>
                </div>
              </div>
              <div className="col-4">
                <div className="social-source text-center mt-3">
                  <div className="avatar-xs mx-auto mb-3">
                    <span
                      className="avatar-title rounded-circle font-size-18 bg-warning"
                    >
                      <i className="mdi mdi-format-align-middle text-white"></i>
                    </span>
                  </div>
                  <h5 className="font-size-15">Medium</h5>
                  <p className="text-muted mb-0">{series[1]} Alarms</p>
                </div>
              </div>
              <div className="col-4">
                <div className="social-source text-center mt-3">
                  <div className="avatar-xs mx-auto mb-3">
                    <span
                      className="avatar-title rounded-circle font-size-18 bg-danger"
                    >
                      <i className="mdi mdi-priority-high text-white"></i>
                    </span>
                  </div>
                  <h5 className="font-size-15">High</h5>
                  <p className="text-muted mb-0">{series[2]} Alarms</p>
                </div>
              </div>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default ThreatsByPriority;
