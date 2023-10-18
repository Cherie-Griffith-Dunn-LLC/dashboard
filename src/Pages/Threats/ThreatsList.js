import React from 'react';

import { Row, Col } from 'reactstrap';

//import { ThreatsData } from '../../CommonData/Data/index';



const ThreatsList = (props) => {

    const alarms = props.alarmsData["_embedded"].alarms;
    //const pageData = props.alarmsData.page;

    console.log(alarms);
    
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
                                        {alarms.map((item, key) => (<tr key={key}>
                                            <td>
                                                <div className="avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-soft-primary text-success">
                                                        <i className="mdi mdi-biohazard"></i>
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="mb-1 font-size-12">{item.rule_strategy}</p>
                                                <h5 className="font-size-15 mb-0">{item.rule_method}</h5>
                                            </td>
                                            <td>{item.priority_label}</td>
                                            <td>{item.status}</td>
                                            <td>{item.source_name}</td>

                                            <td>
                                                {item.destination_name}
                                            </td>
                                            <td>{item.source_username}</td>
                                            <td>{item.destination_username}</td>
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
        </React.Fragment>
    )
}

export default ThreatsList;