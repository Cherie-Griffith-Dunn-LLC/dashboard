import React from 'react';

import { Modal, Container } from 'reactstrap';
import { daysAgo } from '../../helpers/data_helper';
import { formatDate } from '@fullcalendar/core';



const ThreatModal = (props) => {

    const showModal = props.showModal;

    const threat = props.threatDetails;

    
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
                        {threat?.name}
                    </h5>
                <button
                    onClick={() => {
                    props.tog_threatDetails(false);
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
                    <h6>Vulnerabilities Details</h6>
                    <p>First seen {threat?.daysDetected} days ago.</p>
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0">
                            <tbody>
                                <tr>
                                    <td>Vendor</td>
                                    <td>{threat?.vendor}</td>
                                </tr>
                                <tr>
                                    <td>Severity</td>
                                    <td>{threat?.highestSeverity}</td>
                                </tr>
                                <tr>
                                    <td>NVD Score</td>
                                    <td>{threat?.highestNvdBaseScore}</td>
                                </tr>
                                <tr>
                                    <td>Endpoints</td>
                                    <td>{threat?.endpointCount}</td>
                                </tr>
                                <tr>
                                    <td>Detection Date</td>
                                    <td>{formatDate(threat?.detectionDate)}</td>
                                </tr>
                                <tr>
                                    <td>CVE Count</td>
                                    <td>{threat?.cveCount}</td>
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

export default ThreatModal;