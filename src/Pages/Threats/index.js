import React from 'react';
import { Container } from "reactstrap";
import ThreatsList from './ThreatsList';

import { getAlarms, getDictionary } from "../../store/actions";

import { useSelector, useDispatch } from "react-redux";


//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

    const Threats = () => {
        document.title = "Threats | CYPROTECK - Security Solutions Dashboard";

        const dispatch = useDispatch();
        // dispatch getAlarms and return the alarms
        const { alarms } = useSelector(state => ({
            alarms: state.alienAlarms.alarms,
        }));
        const { loading } = useSelector(state => ({
            loading: state.alienAlarms.loading,
        }));
        const { error } = useSelector(state => ({
            error: state.alienAlarms.error,
        }));
        const {dictionary} = useSelector(state => ({
            dictionary: state.alienDictionary,
        }));

        React.useEffect(() => {
            dispatch(getAlarms(20));
            dispatch(getDictionary());
        }, [dispatch]);


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