import React, { useState } from 'react';
import ThreatModal from './threatModal';

import { Row, Col } from 'reactstrap';


import { formatDate } from '@fullcalendar/core';


const ThreatsList = (props) => {

    const alarms = props.alarmsData?.data;

    //const pageData = props.alarmsData.page;

    const [showThreatDetails, setShowThreatDetails] = useState(false);
    const [threatDetails, setThreatDetails] = useState({});

    function tog_threatDetails (item) {
        setThreatDetails(item);
        setShowThreatDetails(!showThreatDetails);
    }
    
    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0">

                                    <thead>
                                        <tr>
                                            <th scope="col" style={{ width: "60px" }}></th>
                                            <th scope="col">Application Name</th>
                                            <th scope="col">Vendor</th>
                                            <th scope="col">Severity</th>
                                            <th scope="col">Endpoints</th>
                                            <th scope="col">NVD Score</th>
                                            <th scope="col">First Seen</th>
                                            <th scope="col">Days from detection</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alarms.map((item, key) => (<tr onClick={() => { tog_threatDetails(item) }} key={key}>
                                            <td>
                                                <div className="avatar-xs">
                                                    <span className={"avatar-title rounded-circle " + (item?.highestSeverity === "CRITICAL" ? "bg-soft-danger text-danger" : item?.highestSeverity === "HIGH" ? "bg-soft-danger text-danger" : item?.highestSeverity === "MEDIUM" ? "bg-soft-warning text-warning":"bg-soft-primary text-success")}>
                                                        <i className="mdi mdi-security"></i>
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                            {item?.name}
                                            </td>
                                            <td>
                                                {item?.vendor}
                                            </td>
                                            <td><span className={item?.highestSeverity === "CRITICAL" ? "badge rounded-pill text-bg-danger" : item?.highestSeverity === "HIGH" ? "badge rounded-pill text-bg-danger" : item?.highestSeverity === "MEDIUM" ? "badge rounded-pill text-bg-warning" : "badge rounded-pill text-bg-secondary"}>
                                                    {item?.highestSeverity}
                                                </span></td>
                                            <td>
                                            {item?.highestSeverity}
                                            </td>

                                            <td>
                                                {item?.vulnerability?.cvssScore}
                                            </td>
                                            <td>{formatDate(item?.detectionDate)}</td>
                                            <td>{item?.daysDetected} Days</td>
                                            <td>
                                                <button
                                                    onClick={() => { tog_threatDetails(item) }}
                                                    type="button"
                                                    className="btn btn-outline-success btn-sm me-1">View Details</button>
                                            </td>
                                        </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <ThreatModal threatDetails={threatDetails} setShowModal={setShowThreatDetails} tog_threatDetails={tog_threatDetails} showModal={showThreatDetails} />
        </React.Fragment>
    )
}

export default ThreatsList;