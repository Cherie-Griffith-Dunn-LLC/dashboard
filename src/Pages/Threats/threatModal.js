import React from 'react';

import { Row, Col, Modal } from 'reactstrap';
import { daysAgo } from '../../helpers/data_helper';




const ThreatModal = (props) => {

    const showModal = props.showModal;
    const setShowModal = props.setShowModal;

    const threat = props.threatDetails;
    console.log(threat);

    
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
                        {threat?.rule_strategy}
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
                    <h6>{threat?.rule_method}</h6>
                    <p>{daysAgo(threat?.timestamp_occured)}</p>
                    <div class="table-responsive">
                        <table className="table table-centered table-nowrap mb-0">
                            <tbody>
                                <tr>
                                    <td>Priority</td>
                                    <td>{threat?.priority_label}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>{threat?.status}</td>
                                </tr>
                                <tr>
                                    <td>Sensors</td>
                                    <td>{threat?.sensor_uuid}</td>
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