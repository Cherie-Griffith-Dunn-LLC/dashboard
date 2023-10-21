import React from 'react';

import { Modal } from 'reactstrap';
import { daysAgo } from '../../helpers/data_helper';




const DWMModal = (props) => {

    const showModal = props.showModal;

    const leak = props.leakDetails;


    
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
                        {leak?.rule_strategy}
                    </h5>
                <button
                    onClick={() => {
                    props.tog_alarmDetails(false);
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
                    <h6>{leak?.event_name}</h6>
                    <p>{leak?.plugin_device_type}</p>
                    <p>{daysAgo(leak?.timestamp_occured)}</p>
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0">
                            <tbody>
                                {leak?.event_severity && (
                                    <tr>
                                        <td>Event Severity</td>
                                        <td>{leak?.event_severity}</td>
                                    </tr>
                                )}
                                {leak?.highlight_fields?.map((item, index) => (
                                    leak[item] && (
                                        item.includes('customfield') ? (
                                            <tr key={index}>
                                                <td>{leak["customheader_" + item.match(/\d+/g)[0]]}</td>
                                                <td>{leak[item]}</td>
                                            </tr>
                                        ) : (
                                            <tr key={index}>
                                                <td>{item.replaceAll('_', ' ')}</td>
                                                <td>{leak[item]}</td>
                                            </tr>
                                        )
                                    )
                                ))}
                                <tr>
                                    <td>Event Type</td>
                                    <td>{leak?.event_type}</td>
                                </tr>
                                <tr>
                                    <td>Event Source</td>
                                    <td>{leak?.source_name ? leak?.source_name : leak?.source_username}</td>
                                </tr>
                                <tr>
                                    <td>Packet Type</td>
                                    <td>{leak?.packet_type}</td>
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

export default DWMModal;