import React from 'react';
import { Container } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

    const Courses = () => {
        document.title = "Courses | CYPROTECK - Security Solutions Dashboard";


        return (
            <>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Dashboard" breadcrumbItem="Courses" />
                        
                        <p>Coming soon.</p>

                    </Container>
                </div>
            </>
        );
    }

export default Courses;