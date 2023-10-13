import React from 'react';
import { Container } from "reactstrap";
import DWMList from './DWMList';

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

    const DarkWebMonitoring = () => {
        document.title = "Dark Web Monitoring | CYPROTECK - Security Solutions Dashboard";
        return (
            <>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Dashboard" breadcrumbItem="Dark Web Monitoring" />
                        
                        <DWMList />

                    </Container>
                </div>
            </>
        );
    }

export default DarkWebMonitoring;