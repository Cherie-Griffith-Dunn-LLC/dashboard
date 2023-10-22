import React from "react";
import { Link } from "react-router-dom";

//SimpleBar
import SimpleBar from "simplebar-react";


import { Card, CardBody, CardTitle, Col } from "reactstrap";
import { getAlarmIcon } from "../../helpers/data_helper";

// import { ThreatsData } from "../../CommonData/Data/index";

const RecentThreats = (props) => {

  const [alarms, setAlarms] = React.useState([]);

  const role = props.role;
  
  const alarmsData = props.alarms;
  const error = props.alarms?.error;
  const loading = props.alarms?.loading;

  React.useEffect(() => {
    if (!loading && alarmsData) {
      if(role === "admin") {
        setAlarms(getAlarmIcon(alarmsData.alarms._embedded.alarms));
      } else {
        setAlarms(getAlarmIcon(alarmsData.investigation._embedded.alarms));
      }
    }
  }, [alarmsData, loading]);

  if (error) {
    console.error(error);
  }

  if (loading) {
    return (
      <React.Fragment>
        <Col lg={4}>
          <Card>
            <CardBody>
              <CardTitle>Recent Threats</CardTitle>
  
              <div className="pe-3">
                <p>Loading...</p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </React.Fragment>
    );
  }


  return (
    <React.Fragment>
      <Col lg={4}>
        <Card>
          <CardBody>
            <CardTitle>Recent Threats</CardTitle>

            <div className="pe-3">
              <SimpleBar style={{ maxHeight: "287px" }}>
                {alarms.map((item, key) => (
                  <Link key={key} to="#" className="text-body d-block">
                    <div className="d-flex py-3">
                      <div className="flex-shrink-0 me-3 align-self-center">
                        {item.src ? (
                          <img
                            className="rounded-circle avatar-xs"
                            alt=""
                            src={item.src}
                          />
                        ) : (
                          <div className="avatar-xs">
                              <span className={"avatar-title rounded-circle bg-soft-primary text-" + (item.priority_label === "high" ? "bg-soft-danger text-danger" : item.priority_label === "medium" ? "bg-soft-warning text-warning":"bg-soft-primary text-success")}>
                                  <i className={item.icon}></i>
                              </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-size-14 mb-1">{item.rule_strategy}</h5>
                        <p className="text-truncate mb-0">{item.rule_method}</p>
                      </div>
                      <div className="flex-shrink-0 font-size-13">
                        {item.time}
                      </div>
                    </div>
                  </Link>
                ))}
              </SimpleBar>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};
export default RecentThreats;
