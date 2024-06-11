import React, { useState } from 'react';
import EventModal from './eventModal';

import { Row, Col } from 'reactstrap';

import { daysAgo } from '../../helpers/data_helper';

//import { EventsData } from '../../CommonData/Data/index';

import { getDeviceIcon } from '../../helpers/data_helper';

const EventsList = (props) => {

    const events = props.eventsData.events?.data ? getDeviceIcon(props.eventsData.events?.data) : [];

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
        <th scope="col" style={{ width: "60px" }}></th>
        <th scope="col">Device Name</th>
        <th scope="col">Health</th>
        <th scope="col">Logged in User</th>
        <th scope="col">Domain</th>
        <th scope="col">Last Active</th>
        <th scope="col">Last Scan</th>
    </tr>
</thead>
<tbody>
    {events.map((item, key) => (<tr onClick={() => { tog_eventDetails(item) }} key={key}>
        <td>
            <div className="avatar-xs">
                <span className={"avatar-title rounded-circle " + (item?.activeThreats > 0 ? "bg-soft-danger text-danger" : "bg-soft-primary text-success")}>
                    <i className={item?.icon}></i>
                </span>
            </div>
        </td>
        <td>
            <p className="mb-1 font-size-12">{item?.computerName}</p>
            <h5 className="font-size-15 mb-0">{item?.threatInfo?.classification}</h5>
        </td>
        <td>
            <span className={item?.infected ? "badge rounded-pill text-bg-danger" : "badge rounded-pill text-bg-success"}>
                {item?.infected ? "Infected" : "Healthy"}
            </span>
        </td>
        <td>
            {item?.threatInfo?.mitigationStatus === "mitigated" ? <i className="mdi mdi-lock-check text-success"> </i> : null}
            {item?.lastLoggedInUserName}
        </td>
        <td>{item?.domain}</td>

        <td>
            {item?.lastActiveDate ? daysAgo(item?.lastActiveDate) : "N/A"}
        </td>
        <td>{item?.lastSuccessfulScanDate ? daysAgo(item?.lastSuccessfulScanDate) : "N/A"}</td>
        <td>
            <button
                onClick={() => { tog_eventDetails(item) }}
                type="button"
                className="btn btn-outline-success btn-sm me-1">View Details</button>
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