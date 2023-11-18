import React from 'react';
import { Container } from "reactstrap";
import RequiredAssignments from "./RequiredAssignments";
import EmployeeAssignments from "./EmployeeAssignments";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

    const Courses = () => {
        document.title = "Courses | CYPROTECK - Security Solutions Dashboard";

        const [role, setRole] = React.useState('');

        React.useEffect(() => {
            let role = localStorage.getItem('role');
            setRole(role);
        }, []);

        return (
            <>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Dashboard" breadcrumbItem="Courses" />
                        
                        <RequiredAssignments />

                        {role === 'admin' ? (
                            <EmployeeAssignments />
                        ) : null}

                    </Container>
                </div>
            </>
        );
    }

export default Courses;