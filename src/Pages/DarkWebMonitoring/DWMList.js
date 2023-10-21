import React, { useState } from 'react';
import DWMModal from './dwmModal';

import { Row, Col } from 'reactstrap';


const DWMList = (props) => {

    const alarms = props.alarmsData["_embedded"].eventResources;


    //const pageData = props.alarmsData.page;

    const [showAlarmDetails, setShowAlarmDetails] = useState(false);
    const [alarmDetails, setAlarmDetails] = useState({});

    function tog_alarmDetails (item) {
        setAlarmDetails(item);
        setShowAlarmDetails(!showAlarmDetails);
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
                                            <th scope="col">Source User</th>
                                            <th scope="col">Public Breach</th>
                                            <th scope="col">Breach Date</th>
                                            <th scope="col">Infected user</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alarms.map((item, key) => (<tr onClick={() => { tog_alarmDetails(item) }} key={key}>
                                            <td>
                                               <div className="avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-soft-primary text-success">
                                                        <i className="mdi mdi-gmail"></i>
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="mb-1 font-size-12">{item.source_dns_domain}</p>
                                                <h5 className="font-size-15 mb-0">{item.source_user_email}</h5>
                                            </td>
                                            <td>{item.customfield_0}</td>
                                            <td>{item.event_ref_date}</td>

                                            <td>
                                                {item.customfield_1}
                                            </td>
                                            <td>
                                                <button type="button" className="btn btn-outline-success btn-sm me-1">View Details</button>
                                            </td>
                                        </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <DWMModal leakDetails={alarmDetails} setShowModal={setShowAlarmDetails} tog_alarmDetails={tog_alarmDetails} showModal={showAlarmDetails} />
        </React.Fragment>
    )
}

export default DWMList;