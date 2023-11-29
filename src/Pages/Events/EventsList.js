import React, { useState } from 'react';
import EventModal from './eventModal';

import { Row, Col } from 'reactstrap';

import { daysAgo } from '../../helpers/data_helper';

//import { EventsData } from '../../CommonData/Data/index';

const EventsList = (props) => {

    const events = props.eventsData.events["_embedded"]?.eventResources ? props.eventsData.events["_embedded"]?.eventResources : [];

    const [showEventDetails, setShowEventDetails] = useState(false);
    const [eventDetails, setEventDetails] = useState({});

    function tog_eventDetails (item) {
        setEventDetails(item);
        setShowEventDetails(!showEventDetails);
    }


    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0">

                                    <thead>
                                        <tr>
                                            <th scope="col">Event Name</th>
                                            <th scope="col">Time Occured</th>
                                            <th scope="col">Source Asset</th>
                                            <th scope="col">Destination Asset</th>
                                            <th scope="col">Username</th>
                                            <th scope="col" style={{ width: "60px" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.map((item, key) => (<tr onClick={() => { tog_eventDetails(item) }} key={key}>
                                            <td>
                                                <p className="mb-1 font-size-12">{item.event_name}</p>
                                            </td>
                                            <td>{daysAgo(item.timestamp_occured)}</td>
                                            <td>{item.source_address}</td>

                                            <td>
                                                {item.destination_address}
                                            </td>
                                            <td>{item.source_username}</td>
                                            <td>
                                                <button type="button" className="btn btn-outline-success btn-sm me-1">View Details</button>
                                            </td>
                                        </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <EventModal eventDetails={eventDetails} setShowModal={setShowEventDetails} tog_eventDetails={tog_eventDetails} showModal={showEventDetails} />
        </React.Fragment>
    )
}

export default EventsList;