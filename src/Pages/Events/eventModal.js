import React from 'react';

import { Modal, Container } from 'reactstrap';
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
                    <h6>{event?.event_name}</h6>
                    <p>{event?.plugin_device_type}</p>
                    <p>{daysAgo(event?.timestamp_occured)}</p>
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0">
                            <tbody>
                                {event?.event_severity && (
                                    <tr>
                                        <td>Event Severity</td>
                                        <td>{event?.event_severity}</td>
                                    </tr>
                                )}
                                {event?.highlight_fields?.map((item, index) => (
                                    event[item] && (
                                        item.includes('customfield') ? (
                                            <tr key={index}>
                                                <td>{event["customheader_" + item.match(/\d+/g)[0]]}</td>
                                                <td>{event[item]}</td>
                                            </tr>
                                        ) : (
                                            <tr key={index}>
                                                <td>{item.replaceAll('_', ' ')}</td>
                                                <td>{event[item]}</td>
                                            </tr>
                                        )
                                    )
                                ))}
                                <tr>
                                    <td>Event Type</td>
                                    <td>{event?.event_type}</td>
                                </tr>
                                <tr>
                                    <td>Event Source</td>
                                    <td>{event?.source_name ? event?.source_name : event?.source_username}</td>
                                </tr>
                                <tr>
                                    <td>Packet Type</td>
                                    <td>{event?.packet_type}</td>
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