import React, { useState } from 'react';
import ThreatModal from './threatModal';

import { Row, Col } from 'reactstrap';

import { getLookoutThreatIcon } from '../../helpers/data_helper';

//import { ThreatsData } from '../../CommonData/Data/index';




const ThreatsList = (props) => {

    //const alarms = props.threats ? getAlarmIcon(props.alarmsData["_embedded"]?.alarms) : [];
    const alarms = props.threatsData.threats ? getLookoutThreatIcon(props.threatsData.threats) : [];
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
                                            <th scope="col">Threat Summary</th>
                                            <th scope="col">Priority</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">User</th>
                                            <th scope="col">Application</th>
                                            <th scope="col">Created Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alarms.map((item, key) => (<tr onClick={() => { tog_threatDetails(item) }} key={key}>
                                            <td>
                                                <div className="avatar-xs">
                                                    <span className={"avatar-title rounded-circle " + (item.risk === "HIGH" ?
                                                    "bg-soft-danger text-danger" : item.risk === "MEDIUM" ?
                                                    "bg-soft-warning text-warning": item.risk === "LOW" ?
                                                    "bg-soft-secondary text-secondary" :"bg-soft-info text-primary")}>
                                                        <i className={item.icon}></i>
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="mb-1 font-size-12">{item.type}</p>
                                                <h5 className="font-size-15 mb-0">{item.classification}</h5>
                                            </td>
                                            <td>
                                                {item.risk.toUpperCase()}
                                            </td>
                                            <td>{item.status}</td>
                                            <td>{item.device.email}</td>

                                            <td>
                                                {item.details.application_name}
                                            </td>
                                            <td>{item.created_time}</td>
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
            <ThreatModal  threatDetails={threatDetails} setShowModal={setShowThreatDetails} tog_threatDetails={tog_threatDetails} showModal={showThreatDetails} />
        </React.Fragment>
    )
}

export default ThreatsList;