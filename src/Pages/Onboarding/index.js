import React from 'react';
import { Container } from "reactstrap";
import FormWizard from './FormWizard';

import { getAllDWM } from "../../store/actions";

import { useSelector, useDispatch } from "react-redux";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

    const Onboarding = () => {
        document.title = "Setup | CYPROTECK - Security Solutions Dashboard";

        const dispatch = useDispatch();
        // dispatch getAlarms and return the alarms
        const { alarms } = useSelector(state => ({
            alarms: state.alienDWM.alarms,
        }));
        const { loading } = useSelector(state => ({
            loading: state.alienDWM.loading,
        }));
        const { error } = useSelector(state => ({
            error: state.alienDWM.error,
        }));
        React.useEffect(() => {
            dispatch(getAllDWM(20));
        }, [dispatch]);

        return (
            <>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Dashboard" breadcrumbItem="Setup" />
                        
                        {loading ? <p>Loading...</p> : error ? <p>Error, try again</p> : <FormWizard alarmsData={alarms} />}

                    </Container>
                </div>
            </>
        );
    }

export default Onboarding;