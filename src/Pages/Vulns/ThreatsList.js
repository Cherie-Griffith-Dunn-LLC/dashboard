import React, { useState } from 'react';
import ThreatModal from './threatModal';

import { Row, Col } from 'reactstrap';

import { getAlarmIcon } from '../../helpers/data_helper';

//import { ThreatsData } from '../../CommonData/Data/index';

import { formatDate } from '@fullcalendar/core';


const ThreatsList = (props) => {

    const alarms = props.alarmsData?.results;

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
                                            <th scope="col">Vulnerability ID</th>
                                            <th scope="col">Vulnerability Name</th>
                                            <th scope="col">Asset</th>
                                            <th scope="col">Severity</th>
                                            <th scope="col">Score</th>
                                            <th scope="col">First Seen</th>
                                            <th scope="col">Last Seen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alarms.map((item, key) => (<tr onClick={() => { tog_threatDetails(item) }} key={key}>
                                            <td>
                                                <div className="avatar-xs">
                                                    <span className={"avatar-title rounded-circle " + (item.vulnerability.cvssSeverity === "High" ? "bg-soft-danger text-danger" : item.vulnerability.cvssSeverity === "Medium" ? "bg-soft-warning text-warning":"bg-soft-primary text-success")}>
                                                        <i className="mdi mdi-security"></i>
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                            {item.vulnerability.cve}
                                            </td>
                                            <td>
                                                {item.vulnerability?.name}
                                            </td>
                                            <td>{item.asset?.name}</td>
                                            <td>
                                                <span className={item.vulnerability.cvssSeverity === "High" ? "badge rounded-pill text-bg-danger" : item.vulnerability.cvssSeverity === "Medium" ? "badge rounded-pill text-bg-warning" : "badge rounded-pill text-bg-secondary"}>
                                                    {item.vulnerability.cvssSeverity}
                                                </span>
                                            </td>

                                            <td>
                                                {item.vulnerability.cvssScore}
                                            </td>
                                            <td>{formatDate(item.vulnerability.firstSeen)}</td>
                                            <td>{formatDate(item.vulnerability.lastSeen[item.vulnerability.lastSeen.length - 1])}</td>
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