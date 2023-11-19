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
    Modal
} from "reactstrap";
import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getRequiredCourses, viewCourse } from '../../store/actions';
import { daysAgo } from '../../helpers/data_helper';
import { Link } from 'react-router-dom';

import img1 from "../../assets/images/lms/malware.jpg";


const RequiredAssignments = () => {

    const dispatch = useDispatch();

    const myCourses = useSelector(state => state.lmsAssignedCourses);
    const selectedCourse = useSelector(state => state.lmsMyCourses);

    const [modal_fullscreen, setmodal_fullscreen] = useState(false);

    function tog_fullscreen() {
        setmodal_fullscreen(!modal_fullscreen);
      }

    React.useEffect(() => {
        dispatch(getRequiredCourses());
    }, [dispatch]);

    // a function to handle the view course button
    const handleViewCourse = (courseId) => {
        // dispatch the view course action
        dispatch(viewCourse(courseId));
        // show the modal for iframe
        tog_fullscreen();
    };

    // if loading return loading
    if (myCourses.loading) {
        return <p>Loading...</p>;
    }

    // if error return error
    if (myCourses.error) {
        return (
            <React.Fragment>
                <div className="alert alert-danger mb-0" role="alert">An error has occured: {myCourses.error}</div>
            </React.Fragment>
            );
    }

    // if no courses return no courses
    if (myCourses.courses.length === 0) {
        return (
            <React.Fragment>
                <h2 className="mt-4">My Assignments</h2>
                <p>No courses assigned to you at this time.</p>
            </React.Fragment>
        );
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
                                onClick={() => handleViewCourse(course.id)}
                                className="btn btn-primary"
                            >
                                View
                            </Link>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal
                size="xl"
                isOpen={modal_fullscreen}
                toggle={() => {
                tog_fullscreen();
                }}
                className="modal-fullscreen"
            >
                <div className="modal-header">
                <h5
                    className="modal-title mt-0"
                    id="exampleModalFullscreenLabel"
                >
                    Training Course
                </h5>
                <button
                    onClick={() => {
                    setmodal_fullscreen(false);
                    }}
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div className="modal-body">
                <iframe src={selectedCourse.url} width="100%" height="100%" title="Course"></iframe>
                </div>
                <div className="modal-footer">
                <button
                    type="button"
                    onClick={() => {
                    tog_fullscreen();
                    }}
                    className="btn btn-secondary "
                    data-dismiss="modal"
                >
                    Close
                </button>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default RequiredAssignments;