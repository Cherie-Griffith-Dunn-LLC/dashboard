import React from 'react';

import { Modal, Container } from 'reactstrap';
import { daysAgo } from '../../helpers/data_helper';




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
                        {threat?.threatInfo?.classification}
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
                    <h6>{threat?.threatInfo?.threatName}</h6>
                    <p>{daysAgo(threat?.threatInfo?.createdAt)}</p>
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0">
                            <tbody>
                                <tr>
                                    <td>Priority</td>
                                    <td>{threat?.priority_label}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>{threat?.threatInfo?.mitigationStatus.toUpperCase()}</td>
                                </tr>
                                {threat?.icon === "mdi mdi-biohazard" ? (
                                    <>
                                        <tr>
                                            <td>Username:</td>
                                            <td>{threat?.source_username}</td>
                                        </tr>
                                        <tr>
                                            <td>Source NT Domain:</td>
                                            <td>{threat?.source_ntdomain}</td>
                                        </tr>
                                        <tr>
                                            <td>File Name:</td>
                                            <td>{threat?.threatInfo?.threatName}</td>
                                        </tr>
                                        <tr>
                                            <td>Confidence level:</td>
                                            <td>{threat?.threatInfo?.confidenceLevel.toUpperCase()}</td>
                                        </tr>
                                    </>
                                ) : (
                                    <>
                                        <tr>
                                            <td>Destination Username:</td>
                                            <td>{threat?.destination_username}</td>
                                        </tr>
                                        <tr>
                                            <td>Audit Reason:</td>
                                            <td>{threat?.audit_reason}</td>
                                        </tr>
                                        <tr>
                                            <td>Rule Attack Tactic:</td>
                                            <td>{threat?.rule_attack_tactic}</td>
                                        </tr>
                                        <tr>
                                            <td>Rule Attack Technique:</td>
                                            <td>{threat?.rule_attack_technique}</td>
                                        </tr>
                                    </>
                                )}
                                <tr>
                                    <td>Sensors</td>
                                    <td>{threat?.sensor_uuid}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Container>
                        <h6>Description</h6>
                        <div className="row mb-0">
                            <p className="col-sm-3">Method:</p>
                            <p className="col-sm-9"></p>

                            <p className="col-sm-3">Strategy:</p>
                            <p className="col-sm-9"></p>

                            <p className="col-sm-3">Intent:</p>
                            <p className="col-sm-9"></p>
                        </div>
                    </Container>
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