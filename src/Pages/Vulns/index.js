import React from 'react';
import { Container } from "reactstrap";
import ThreatsList from './ThreatsList';

import { getVulns } from "../../store/actions";

import { useSelector, useDispatch } from "react-redux";


//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

    const Vulns = () => {
        document.title = "Vulnerabilities | CYPROTECK - Security Solutions Dashboard";

        const role = localStorage.getItem('role');

        const dispatch = useDispatch();
        // dispatch getAlarms and return the alarms
        const { alarms } = useSelector(state => ({
            alarms: state.alienVulns.vulns,
        }));
        const { loading } = useSelector(state => ({
            loading: state.alienVulns.loading,
        }));
        const { error } = useSelector(state => ({
            error: state.alienVulns.error,
        }));

        React.useEffect(() => {
            if (role === "admin") {
                dispatch(getVulns(20));
            }
        }, [dispatch, role]);



        return (
            <>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Dashboard" breadcrumbItem="Vulnerabilities" />
                        
                        {loading ? <p>Loading...</p> : error ? <div className="alert alert-danger mb-4" role="alert">An error occured. Please try again.</div> :
                            <ThreatsList alarmsData={alarms} />
                        }

                    </Container>
                </div>
            </>
        );
    }

export default Vulns;