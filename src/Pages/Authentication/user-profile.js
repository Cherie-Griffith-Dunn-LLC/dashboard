
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Form,
} from "reactstrap";


//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

//import avatar from "../../assets/images/users/avatar-1.jpg";
// actions
import { resetProfileFlag } from "../../store/actions";
//import { set } from "lodash";

import { postOrgUsers } from "../../store/actions";

const UserProfile = () => {
  document.title = "Settings | CYPROTECK - Security Solutions Dashboard";

  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState(1);
  const [ userDetails, setUserDetails ] = useState({});
  const [role, setRole] = useState("");

  const { error, success } = useSelector((state) => ({
    error: state.profile.error,
    success: state.profile.success,
  }));


  const postUsersState  = useSelector(state => state.azureAddUsers);

  const handleImport = (e) => {
    e.preventDefault();
    dispatch(postOrgUsers());
  }

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      setname(obj.displayName);
      setemail(obj.mail);
      setidx(obj.id);
      setUserDetails(obj);
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
    if (localStorage.getItem("role")) {
      setRole(localStorage.getItem("role"));
    }
    
  }, [dispatch, success]);

  return (
    <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumb title="Dashboard" breadcrumbItem="Settings" />

            <Row>
              <Col lg="12">
                {error && error ? (
                  <Alert color="danger">
                    <div>{error}</div>
                  </Alert>
                ) : null}
                {success ? (
                  <Alert color="success">
                    <div>{success}</div>
                  </Alert>
                ) : null}

                <Card>
                  <CardBody>
                    <div className="d-flex">
                      <div className="ms-3">
                        <div className="avatar-md">
                            <span className="avatar-title rounded-circle bg-soft-primary text-success">
                                {name.charAt(0)}
                            </span>
                        </div>
                      </div>
                      <div className="flex-grow-1 align-self-center">
                        <div className="text-muted">
                          <h5>{name}</h5>
                          <p className="mb-1">{email}</p>
                          <p className="mb-0">{userDetails.jobTitle}</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {postUsersState.error && postUsersState.error ? (
                <Alert color="danger">
                  <div>An error has occured: {postUsersState?.error?.message}</div>
                </Alert>
              ) : null}
              {postUsersState?.message ? (
                <Alert color="success">
                  <div>{postUsersState?.message}</div>
                </Alert>
              ) : null}

            {postUsersState?.loading ? (
              <div className="text-center mt-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Importing...</span>
                </div>
              </div>
            ) : null}

            {role === "admin" ? (
              <>
              <h4 className="card-title mb-4">Users</h4>

              

              <Card>
                <CardBody>
                    
                    <div className="text-center mt-4">
                      <Button type="submit" color="primary" onClick={handleImport}>
                        Import Users
                      </Button>
                    </div>
                </CardBody>
              </Card>
              </>
              ) : null}
          </Container>
        </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
