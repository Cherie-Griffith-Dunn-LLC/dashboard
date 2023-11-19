import React from 'react';
import {
    Col,
    Row,
} from "reactstrap";

import { useSelector, useDispatch } from 'react-redux';
import { getEmployeeCourses } from '../../store/actions';
import { formatDate } from '@fullcalendar/core';



const EmployeeAssignments = () => {

    const dispatch = useDispatch();

    const employeeCourses = useSelector(state => state.lmsEmployeeCourses);

    React.useEffect(() => {
        dispatch(getEmployeeCourses());
    }, [dispatch]);

    // if loading return loading
    if (employeeCourses.loading) {
        return <p>Loading...</p>;
    }

    // if error return error
    if (employeeCourses.error) {
        return (
            <React.Fragment>
                <div className="alert alert-danger mb-0" role="alert">
                    An error has occured: {employeeCourses.error}
                </div>
            </React.Fragment>
            );
    }

    // if no courses return no courses
    if (employeeCourses.courses.length === 0) {
        return (
            <React.Fragment>
                <h2 className="mt-4">Employee Assignments</h2>
                <p>No courses assigned to employees at this time.</p>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <h2 className="mt-4">Employee Assignments</h2>
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
                                            <th scope="col">Employee</th>
                                            <th scope="col">Course</th>
                                            <th scope="col">Assigned</th>
                                            <th scope="col">Started</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employeeCourses.loading !== false ? (
                                            <tr><td>Loading...</td></tr>
                                        ) : employeeCourses.courses.length === 0 ? (
                                            <tr><td>No courses assigned to employees at this time.</td></tr>
                                        ) : (
                                            employeeCourses.courses.map((item, key) => (<tr key={key}>
                                                <td>
                                                    <div className="form-check">
                                                        <input type="checkbox" className="form-check-input" id={item.id}
                                                        />
                                                        <label className="form-check-label" htmlFor={item.id}></label>
                                                    </div>
                                                </td>
                                                <td>
                                                    {item.src ? <img src={item.src} alt="user" className="avatar-xs rounded-circle" /> : <div className="avatar-xs">
                                                        <span className={item?.start_date ? "avatar-title rounded-circle bg-soft-primary text-success" : "avatar-title rounded-circle bg-soft-danger text-danger"}>
                                                            {item.employee_name.charAt(0)}
                                                        </span>
                                                    </div>}
                                                </td>
                                                <td>
                                                    <h5 className="font-size-15 mb-0">{item.employee_name}</h5>
                                                </td>
                                                <td>{item.course_name}</td>
                                                <td>{item.assign_date ? formatDate(item.assign_date) : "-/-/-"}</td>
                                                <td>
                                                    {item.start_date ? formatDate(item.start_date) : "-/-/-"}
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-outline-success btn-sm me-1 disabled">Details</button>
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
    );
};

export default EmployeeAssignments;