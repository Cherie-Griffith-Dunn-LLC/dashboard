import React from 'react';
import { Container } from "reactstrap";
import ThreatsList from './ThreatsList';

import { getThreats } from "../../store/actions";

import { useSelector, useDispatch } from "react-redux";


//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

    const MobileSecurity = () => {
        document.title = "Mobile Security | CYPROTECK - Security Solutions Dashboard";

        const dispatch = useDispatch();
        // dispatch getAlarms and return the threats
        const { threats } = useSelector(state => ({
            threats: state.lookoutThreats.threats,
        }));
        const { loading } = useSelector(state => ({
            loading: state.lookoutThreats.loading,
        }));
        const { error } = useSelector(state => ({
            error: state.lookoutThreats.error,
        }));

        React.useEffect(() => {
            dispatch(getThreats(20));
        }, [dispatch]);


        return (
            <>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Dashboard" breadcrumbItem="Mobile Security" />
                        
                        {loading ? <p>Loading...</p> : error ? <div className="alert alert-danger mb-4" role="alert">An error occured. Please try again.</div> :
                            <ThreatsList threatsData={threats} />
                        }

                    </Container>
                </div>
            </>
        );
    }

export default MobileSecurity;