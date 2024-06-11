import React from 'react';

import { Modal } from 'reactstrap';
import { daysAgo } from '../../helpers/data_helper';




const EventModal = (props) => {

    const showModal = props.showModal;

    const event = props.eventDetails;


    
    return (
        <React.Fragment>
            <Modal
                size="xl"
                isOpen={showModal}
                toggle={() => {
                    props.setShowModal();
                }}
            >
                <div className="modal-header">
                    <h5
                        className="modal-title mt-0"
                        id="myExtraLargeModalLabel"
                    >
                        {event?.rule_strategy}
                    </h5>
                <button
                    onClick={() => {
                    props.tog_eventDetails(false);
                    }}
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div className="modal-body">
                    <h6>{event?.computerName} • {event?.osName}</h6>
                    <p>{event?.infected ? "Infected" : "Healthy"}</p>
                    <p>{daysAgo(event?.lastActiveDate)}</p>
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0">
                            <tbody>
                                <tr>
                                    <td>Last logged in</td>
                                    <td>{event?.lastLoggedInUserName}</td>
                                </tr>
                                <tr>
                                    <td>Full Disk Scan</td>
                                    <td>{event?.scanStatus?.toUpperCase()}</td>
                                </tr>
                                <tr>
                                    <td>Device Model</td>
                                    <td>{event?.modelName}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        onClick={() => {
                            props.setShowModal();
                        }}
                        className="btn btn-secondary "
                        data-dismiss="modal"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </React.Fragment>
    )
}

export default EventModal;