import React from 'react';
import LineColumnArea from './LineColumnArea';

import {
    Card,
    CardBody,
    Col,
    Row
} from "reactstrap";

// import { OverViewData } from '../../CommonData/Data/index';


const OverView = (props) => {
    const events = props.events;
    const alarms = props.alarms;
    const courseStats = props.courseStats;
    const role = props.role;

    const loading = role === "admin" ? events.loading || alarms.loading || courseStats.loading : alarms.loading;


    if (loading) {
        return (
            <React.Fragment>
                <Col xl={8}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h5 className="card-title">Overview</h5>
                                </div>
                                <div className="flex-shrink-0">
                                    <div>
                                        <button type="button" className="btn btn-soft-secondary btn-sm me-1">
                                            ALL
                                        </button>
                                        <button type="button" className="btn btn-soft-primary btn-sm me-1">
                                            1D
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p>Loading...</p>
                            </div>
                        </CardBody>
                        <CardBody className="border-top">
                        <div className="text-center">
                            <Row>
                                <Col md={4} className="border-end">
                                    <div>
                                        <p className="mb-2"><i className="mdi mdi-circle font-size-12 me-1 text-primary"></i> Courses</p>
                                        <h5 className="font-size-16 mb-0">0</h5>
                                    </div>
                                </Col>
                                <Col md={4} className="border-end">
                                    <div>
                                        <p className="mb-2"><i className="mdi mdi-circle font-size-12 me-1 text-light"></i> Events</p>
                                        <h5 className="font-size-16 mb-0">0</h5>
                                    </div>
                                </Col>
                                <Col md={4} className="border-end">
                                    <div>
                                        <p className="mb-2"><i className="mdi mdi-circle font-size-12 me-1 text-danger"></i> Threats</p>
                                        <h5 className="font-size-16 mb-0">0</h5>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </CardBody>
                    </Card>
                </Col>
            </React.Fragment>
        );
    }

    // admin chart
    if (role === "admin") {
        return (
            <React.Fragment>
                <Col xl={8}>
                    <Card>
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h5 className="card-title">Overview</h5>
                                </div>
                                <div className="flex-shrink-0">
                                    <div>
                                        <button type="button" className="btn btn-soft-secondary btn-sm me-1">
                                            ALL
                                        </button>
                                        <button type="button" className="btn btn-soft-primary btn-sm me-1">
                                            1D
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <LineColumnArea role={role} alarms={alarms} courses={courseStats} events={events} />
                            </div>
                        </CardBody>
                        <CardBody className="border-top">
                            <div className="text-center">
                                <Row>
                                    <Col md={4} className="border-end">
                                        <div>
                                            <p className="mb-2"><i className="mdi mdi-circle font-size-12 me-1 text-primary"></i> Courses</p>
                                            <h5 className="font-size-16 mb-0">{courseStats.statistics.totalAssignedCourses}</h5>
                                        </div>
                                    </Col>
                                    <Col md={4} className="border-end">
                                        <div>
                                            <p className="mb-2"><i className="mdi mdi-circle font-size-12 me-1 text-light"></i> Events</p>
                                            <h5 className="font-size-16 mb-0">{events.events.page?.totalElements}</h5>
                                        </div>
                                    </Col>
                                    <Col md={4} className="border-end">
                                        <div>
                                            <p className="mb-2"><i className="mdi mdi-circle font-size-12 me-1 text-danger"></i> Threats</p>
                                            <h5 className="font-size-16 mb-0">{alarms.alarms?.pagination?.totalItems}</h5>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </React.Fragment>
        );
    }

    // user chart
    return (
        <React.Fragment>
            <Col xl={8}>
                <Card>
                    <CardBody>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <h5 className="card-title">Overview</h5>
                            </div>
                            <div className="flex-shrink-0">
                                <div>
                                    <button type="button" className="btn btn-soft-secondary btn-sm me-1">
                                        ALL
                                    </button>
                                    <button type="button" className="btn btn-soft-primary btn-sm me-1">
                                        1D
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <LineColumnArea role={role} alarms={alarms} courses={courseStats} events={events} />
                        </div>
                    </CardBody>
                    <CardBody className="border-top">
                        <div className="text-center">
                            <Row>
                                <Col md={4} className="border-end">
                                    <div>
                                        <p className="mb-2"><i className="mdi mdi-circle font-size-12 me-1 text-primary"></i> Courses</p>
                                        <h5 className="font-size-16 mb-0">0</h5>
                                    </div>
                                </Col>
                                <Col md={4} className="border-end">
                                    <div>
                                        <p className="mb-2"><i className="mdi mdi-circle font-size-12 me-1 text-light"></i> Events</p>
                                        <h5 className="font-size-16 mb-0">0</h5>
                                    </div>
                                </Col>
                                <Col md={4} className="border-end">
                                    <div>
                                        <p className="mb-2"><i className="mdi mdi-circle font-size-12 me-1 text-danger"></i> Threats</p>
                                        <h5 className="font-size-16 mb-0">{alarms.investigation.page?.totalElements}</h5>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default OverView;