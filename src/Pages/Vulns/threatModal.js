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
                        {threat?.vulnerability?.name}
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
                    <p>{threat?.vulnerability?.lastSeen ? daysAgo(threat?.vulnerability?.lastSeen[threat?.vulnerability?.lastSeen.length - 1]) : "-/-/-"}</p>
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0">
                            <tbody>
                                <tr>
                                    <td>Reference ID</td>
                                    <td>{threat?.vulnerability?.cve}</td>
                                </tr>
                                <tr>
                                    <td>Severity</td>
                                    <td>{threat?.vulnerability?.cvssSeverity}</td>
                                </tr>
                                <tr>
                                    <td>Reliability</td>
                                    <td>{threat?.vulnerability?.reliability}</td>
                                </tr>
                                <tr>
                                    <td>First Seen</td>
                                    <td>{threat?.vulnerability?.firstSeen}</td>
                                </tr>
                                <tr>
                                    <td>Last Seen</td>
                                    <td>{threat?.vulnerability?.lastSeen[threat?.vulnerability?.lastSeen.length - 1]}</td>
                                </tr>
                                <tr>
                                    <td>Rule</td>
                                    <td>{threat?.vulnerability?.ovalRuleId}</td>
                                </tr>
                                <tr>
                                    <td>Asset</td>
                                    <td>{threat?.asset?.name}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Container>
                        <h6>Description</h6>
                        <p>{threat?.vulnerability?.description}</p>
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