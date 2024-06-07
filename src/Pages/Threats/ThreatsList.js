import React, { useState } from 'react';
import ThreatModal from './threatModal';

import { Row, Col } from 'reactstrap';

import { getAlarmIcon } from '../../helpers/data_helper';

//import { ThreatsData } from '../../CommonData/Data/index';




const ThreatsList = (props) => {

    const alarms = props.alarmsData.data ? getAlarmIcon(props.alarmsData.data) : [];
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
                                            <th scope="col">AI Analysis</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Sources</th>
                                            <th scope="col">Machine</th>
                                            <th scope="col">User</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alarms.map((item, key) => (<tr onClick={() => { tog_threatDetails(item) }} key={key}>
                                            <td>
                                                <div className="avatar-xs">
                                                    <span className={"avatar-title rounded-circle " + (item?.threatInfo?.confidenceLevel === "malicious" ? "bg-soft-danger text-danger" : item?.threatInfo?.confidenceLevel === "medium" ? "bg-soft-warning text-warning":"bg-soft-primary text-success")}>
                                                        <i className={item?.icon}></i>
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="mb-1 font-size-12">{item?.threatInfo?.threatName}</p>
                                                <h5 className="font-size-15 mb-0">{item?.threatInfo?.classification}</h5>
                                            </td>
                                            <td>
                                                <span className={item?.threatInfo?.confidenceLevel === "malicious" ? "badge rounded-pill text-bg-danger" : item?.threatInfo?.confidenceLevel === "suspicious" ? "badge rounded-pill text-bg-warning" : "badge rounded-pill text-bg-secondary"}>
                                                    {item?.threatInfo?.confidenceLevel.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                {item?.threatInfo?.mitigationStatus === "mitigated" ? <i className="mdi mdi-lock-check text-success"> </i> : null}
                                                {item?.threatInfo?.mitigationStatusDescription}
                                            </td>
                                            <td>{item?.threatInfo?.classificationSource}</td>

                                            <td>
                                                {item?.agentRealtimeInfo?.agentComputerName}
                                            </td>
                                            <td>{item?.threatInfo?.processUser}</td>
                                            <td>{item?.destination_username}</td>
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