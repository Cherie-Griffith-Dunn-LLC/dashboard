import React from 'react';
import {
    Card,
    CardBody,
    Col,
    Row,
    CardText,
    CardTitle,
    CardImg,
    CardSubtitle,
} from "reactstrap";

import { useSelector, useDispatch } from 'react-redux';
import { getRequiredCourses } from '../../store/actions';
import { daysAgo } from '../../helpers/data_helper';
import { Link } from 'react-router-dom';

import img1 from "../../assets/images/lms/malware.jpg";


const RequiredAssignments = () => {

    const dispatch = useDispatch();

    const myCourses = useSelector(state => state.lmsAssignedCourses);

    React.useEffect(() => {
        dispatch(getRequiredCourses());
    }, [dispatch]);

    // if loading return loading
    if (myCourses.loading) {
        return <p>Loading...</p>;
    }

    // if error return error
    if (myCourses.error) {
        return <p>An error has occured: {myCourses.error}</p>;
    }

    // if no courses return no courses
    if (myCourses.courses.length === 0) {
        return <p>No courses assigned to you at this time.</p>;
    }

    return (
        <React.Fragment>
            <h2 className="mt-4">My Assignments</h2>
            <Row>
                {myCourses.courses.map((course) => (
                    <Col mg={6} xl={3} key={course.id}>
                        <Card>
                            <CardImg top className="img-fluid" src={img1} alt={course.name} />
                            <CardBody>
                            <CardTitle className="mt-0">{course.name}</CardTitle>
                            <CardSubtitle className={course.status === "Not started" ? "mb-2 badge bg-danger rounded-pill" : "mb-2 badge bg-success rounded-pill"}>
                                {course.status}
                            </CardSubtitle>
                            <CardText className='text-truncate'>
                                {course.description}
                            </CardText>
                            <CardText>
                                <small className="text-muted">
                                    Assigned {daysAgo(new Date(course.assign_date))}
                                </small>
                            </CardText>
                            <Link
                                to="#"
                                className="btn btn-primary disabled"
                            >
                                View
                            </Link>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </React.Fragment>
    );
};

export default RequiredAssignments;