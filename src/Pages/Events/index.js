import React from 'react';
import { Container } from "reactstrap";
import EventsList from './EventsList';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

    const Events = () => {
        document.title = "System Activity | CYPROTECK - Security Solutions Dashboard";
        return (
            <>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Dashboard" breadcrumbItem="System Activity" />
                        
                        <EventsList />

                    </Container>
                </div>
            </>
        );
    }

export default Events;