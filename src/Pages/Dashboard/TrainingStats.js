import React from 'react';
import {
    Card,
    CardBody,
    CardTitle,
    Col,
    Row,
} from "reactstrap";

// import { OrderStatusData } from '../../CommonData/Data/index';


const TrainingStats = (props) => {


    const statistics  = props.courseStats.statistics;
    const loading     = props.courseStats.loading;
    const error      = props.courseStats.error;

    React.useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    if (loading) {
        return (
            <React.Fragment>
                <Col xl={4}>
                    <Card>
                        <CardBody>
                            <CardTitle>Training Stats</CardTitle>
                            <div>
                               <p>Loading...</p>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </React.Fragment>
        )
    }


    return (
        <React.Fragment>
            <Col xl={4}>
                <Card>
                    <CardBody>
                        <CardTitle>Training Stats</CardTitle>
                        <div>
                            <ul className="list-unstyled">
                                <li className="py-3">
                                    <div className="d-flex">
                                        <div className="avatar-xs align-self-center me-3">
                                            <div className="avatar-title rounded-circle bg-light text-primary font-size-18">
                                                <i className="ri-checkbox-circle-line"></i>
                                            </div>
                                        </div>

                                        <div className="flex-grow-1">
                                            <p className="mb-2">Completed</p>
                                            <div className="progress progress-sm animated-progess">
                                                <div className="progress-bar bg-success" role="progressbar" style={{ width: ((statistics.totalCompletedCourses / statistics.totalAssignedCourses) * 100)  + "%" }} aria-valuenow={statistics.totalCompletedCourses} aria-valuemin="0" aria-valuemax={statistics.totalAssignedCourses}></div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="py-3">
                                    <div className="d-flex">
                                        <div className="avatar-xs align-self-center me-3">
                                            <div className="avatar-title rounded-circle bg-light text-warning font-size-18">
                                                <i className="ri-calendar-2-line"></i>
                                            </div>
                                        </div>

                                        <div className="flex-grow-1">
                                            <p className="mb-2">In Progress</p>
                                            <div className="progress progress-sm animated-progess">
                                                <div className="progress-bar bg-warning" role="progressbar" style={{ width: ((statistics.totalInProgressCourses / statistics.totalAssignedCourses) * 100)  + "%" }} aria-valuenow={statistics.totalInProgressCourses} aria-valuemin="0" aria-valuemax={statistics.totalAssignedCourses}></div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="py-3">
                                    <div className="d-flex">
                                        <div className="avatar-xs align-self-center me-3">
                                            <div className="avatar-title rounded-circle bg-light text-danger font-size-18">
                                                <i className="ri-close-circle-line"></i>
                                            </div>
                                        </div>

                                        <div className="flex-grow-1">
                                            <p className="mb-2">Not Started</p>
                                            <div className="progress progress-sm animated-progess">
                                                <div className="progress-bar bg-danger" role="progressbar" style={{ width: (((statistics.totalAssignedCourses - statistics.totalInProgressCourses - statistics.totalCompletedCourses) / statistics.totalAssignedCourses) * 100)  + "%" }} aria-valuenow={(statistics.totalAssignedCourses - statistics.totalInProgressCourses - statistics.totalCompletedCourses)} aria-valuemin="0" aria-valuemax={statistics.totalAssignedCourses}></div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        
                        <hr />

                        <div className="text-center">
                            <Row>
                                <div className="col-4">
                                    <div className="mt-2">
                                        <p className="mb-2">Completed</p>
                                        <h5 className="font-size-16 mb-0">{statistics.totalCompletedCourses}</h5>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="mt-2">
                                        <p className="mb-2">In Progress</p>
                                        <h5 className="font-size-16 mb-0">{statistics.totalInProgressCourses}</h5>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="mt-2">
                                        <p className="mb-2">Total</p>
                                        <h5 className="font-size-16 mb-0">{statistics.totalAssignedCourses}</h5>
                                    </div>
                                </div>
                            </Row>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    )
}

export default TrainingStats;