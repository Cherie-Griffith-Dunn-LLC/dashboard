import React from 'react';
import { Container } from "reactstrap";
import ThreatsList from './ThreatsList';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

    const Threats = () => {
        document.title = "Threats | CYPROTECK - Security Solutions Dashboard";
        return (
            <>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Dashboard" breadcrumbItem="Threats" />
                        
                        <ThreatsList />

                    </Container>
                </div>
            </>
        );
    }

export default Threats;