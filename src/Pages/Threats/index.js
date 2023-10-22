import React from 'react';
import { Container } from "reactstrap";
import ThreatsList from './ThreatsList';

import { getAlarms, getDictionary, getInvestigations } from "../../store/actions";

import { useSelector, useDispatch } from "react-redux";


//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

    const Threats = () => {
        document.title = "Threats | CYPROTECK - Security Solutions Dashboard";

        const role = localStorage.getItem('role');

        const dispatch = useDispatch();
        // dispatch getAlarms and return the alarms
        const { alarms } = useSelector(state => ({
            alarms: role === "admin" ? state.alienAlarms.alarms : state.alienInvestigations.investigation,
        }));
        const { loading } = useSelector(state => ({
            loading: role === "admin" ? state.alienAlarms.loading : state.alienInvestigations.loading,
        }));
        const { error } = useSelector(state => ({
            error: role === "admin" ? state.alienAlarms.error : state.alienInvestigations.error,
        }));
        const {dictionary} = useSelector(state => ({
            dictionary: state.alienDictionary,
        }));

        React.useEffect(() => {
            if (role === "admin") {
                dispatch(getAlarms(20));
            } else {
                dispatch(getInvestigations(20));
            }
            dispatch(getDictionary());
        }, [dispatch, role]);



        return (
            <>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Dashboard" breadcrumbItem="Threats" />
                        
                        {(loading || dictionary.loading) ? <p>Loading...</p> : error ? <p>Error, try again</p> :
                            <ThreatsList dictionary={dictionary.dictionary} alarmsData={alarms} />
                        }

                    </Container>
                </div>
            </>
        );
    }

export default Threats;