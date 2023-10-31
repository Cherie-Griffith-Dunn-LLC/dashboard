import React from 'react';

import { Row, Col } from 'reactstrap';

// import { TrainingData } from '../../CommonData/Data/index';

import { useDispatch, useSelector } from "react-redux";

import { getEmployeeTrainingList } from "../../store/actions";

import { formatDate } from '@fullcalendar/core';

const TrainingList = () => {

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getEmployeeTrainingList());
    }, [dispatch]);

    const trainingList = useSelector(state => state.lmsTrainingList);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title mb-4">Employee Training</h4>

                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0">

                                    <thead>
                                        <tr>
                                            <th scope="col" style={{ width: "50px" }}>
                                                <div className="form-check">
                                                    <label className="form-check-label" htmlFor="customCheckall"></label>
                                                </div>
                                            </th>
                                            <th scope="col" style={{ width: "60px" }}></th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Last Course Completed</th>
                                            <th scope="col">Risk Status</th>
                                            <th scope="col">Total Courses</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trainingList.loading !== false ? (
                                            <tr><td>Loading...</td></tr>
                                        ) : (
                                            trainingList.employees.map((item, key) => (<tr key={key}>
                                                <td>
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input" id={item.id}
                                                        />
                                                        <label className="form-check-label" htmlFor={item.id}></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    {item.src ? <img src={item.src} alt="user" className="avatar-xs rounded-circle" /> : <div className="avatar-xs">
                                                        <span className="avatar-title rounded-circle bg-soft-primary text-success">
                                                            {item.name.charAt(0)}
                                                        </span>
                                                    </div>}
                                                </td>
                                                <td>
                                                    <p className="mb-1 font-size-12">{item.job_title.toUpperCase()}</p>
                                                    <h5 className="font-size-15 mb-0">{item.name}</h5>
                                                </td>
                                                <td>{item.email}</td>
                                                <td>{item.mostRecentCompletion ? formatDate(item.mostRecentCompletion) : "-/-/-"}</td>
                                                <td>
                                                    <i className={"mdi mdi-checkbox-blank-circle me-1 text-" + (item.totalAssignments > 1 ? (
                                                        item.totalAssignments > 3 ? "danger" : "warning"
                                                    ) : "success")}></i> {item.totalAssignments > 1 ? (
                                                        item.totalAssignments > 3 ? "High" : "Medium"
                                                    ) : "Low"}
                                                </td>
                                                <td>{item.totalAssignments}</td>
                                                <td>
                                                    <button type="button" className="btn btn-outline-success btn-sm me-1">Details</button>
                                                </td>
                                            </tr>))
                                        )}
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

export default TrainingList;