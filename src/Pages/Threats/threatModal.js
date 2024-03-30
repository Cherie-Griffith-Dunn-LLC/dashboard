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
                                    <td>Status:</td>
                                    <td>{threat?.threatInfo?.incidentStatusDescription}</td>
                                </tr>
                                <tr>
                                    <td>AI Confidence Level:</td>
                                    <td>{threat?.threatInfo?.confidenceLevel}</td>
                                </tr>
                                <tr>
                                    <td>Analyst Verdict:</td>
                                    <td>{threat?.threatInfo?.analystVerdictDescription}</td>
                                </tr>
                                <tr>
                                    <td>Endpoints:</td>
                                    <td>{threat?.agentRealtimeInfo?.agentComputerName}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Container>
                        <h6>Details</h6>
                        <div className="row mb-0">
                            <p className="col-sm-3">File Path:</p>
                            <p className="col-sm-9">{threat?.threatInfo?.filePath}</p>

                            <p className="col-sm-3">Originating Process:</p>
                            <p className="col-sm-9">{threat?.threatInfo?.originatorProcess}</p>

                            <p className="col-sm-3">Mitigation Actions:</p>
                            <p className="col-sm-9">
                                {threat?.mitigationStatus?.map((item, index) => (
                                    <span key={index}>
                                        {item.status ? <i className="mdi mdi-lock-check text-success"> </i> : null}
                                        {item.action}
                                        {item.actionsCounters ? (` ` + item.actionsCounters.success + `/` + item.actionsCounters.total) : null}
                                        <br />
                                    </span>
                                ))}
                            </p>
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