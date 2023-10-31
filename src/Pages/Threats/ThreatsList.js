import React, { useState } from 'react';
import ThreatModal from './threatModal';

import { Row, Col } from 'reactstrap';

import { getAlarmIcon } from '../../helpers/data_helper';

//import { ThreatsData } from '../../CommonData/Data/index';




const ThreatsList = (props) => {

    const alarms = props.alarmsData["_embedded"]?.alarms ? getAlarmIcon(props.alarmsData["_embedded"]?.alarms) : [];
    const dictionary = props.dictionary;
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
                                            <th scope="col">Sources</th>
                                            <th scope="col">Destinations</th>
                                            <th scope="col">Source users</th>
                                            <th scope="col">Destination Users</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alarms.map((item, key) => (<tr onClick={() => { tog_threatDetails(item) }} key={key}>
                                            <td>
                                                <div className="avatar-xs">
                                                    <span className={"avatar-title rounded-circle " + (item.priority_label === "high" ? "bg-soft-danger text-danger" : item.priority_label === "medium" ? "bg-soft-warning text-warning":"bg-soft-primary text-success")}>
                                                        <i className={item.icon}></i>
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="mb-1 font-size-12">{item.rule_strategy}</p>
                                                <h5 className="font-size-15 mb-0">{item.rule_method}</h5>
                                            </td>
                                            <td>
                                                {item.priority_label.toUpperCase()}
                                            </td>
                                            <td>{item.status}</td>
                                            <td>{item.source_name}</td>

                                            <td>
                                                {item.destination_name}
                                            </td>
                                            <td>{item.source_username}</td>
                                            <td>{item.destination_username}</td>
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
            <ThreatModal dictionary={dictionary} threatDetails={threatDetails} setShowModal={setShowThreatDetails} tog_threatDetails={tog_threatDetails} showModal={showThreatDetails} />
        </React.Fragment>
    )
}

export default ThreatsList;