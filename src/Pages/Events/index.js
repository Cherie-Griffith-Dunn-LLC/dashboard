import React from 'react';
import { Container } from "reactstrap";
import EventsList from './EventsList';

import { getSysEvents } from "../../store/actions";

import { useSelector, useDispatch } from "react-redux";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

    const Events = () => {
        document.title = "Devices | CYPROTECK - Security Solutions Dashboard";

        const dispatch = useDispatch();
        
        const { events } = useSelector(state => ({
            events: state.alienEvents,
        }));
        const { loading } = useSelector(state => ({
            loading: state.alienEvents.loading,
        }));
        const { error } = useSelector(state => ({
            error: state.alienEvents.error,
        }));

        React.useEffect(() => {
            dispatch(getSysEvents(20));
        }, [dispatch]);


        return (
            <>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumbs title="Dashboard" breadcrumbItem="Devices" />
                        
                        {loading ? <p>Loading...</p> : error ? <div className="alert alert-danger mb-4" role="alert">An error occured. Please try again.</div> :
                            <EventsList eventsData={events} />
                        }

                    </Container>
                </div>
            </>
        );
    }

export default Events;