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
                    <h6>{threat?.classification}</h6>
                    <p>{daysAgo(threat?.created_time)}</p>
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0">
                            <tbody>
                                <tr>
                                    <td>Risk</td>
                                    <td>{threat?.risk}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>{threat?.status}</td>
                                </tr>
                                <tr>
                                    <td>Source User:</td>
                                    <td>{threat?.device?.email}</td>
                                </tr>
                                <tr>
                                    <td>Application:</td>
                                    <td>{threat?.details?.application_name}</td>
                                </tr>
                                <tr>
                                    <td>Reason:</td>
                                    <td>{threat?.details?.reason}</td>
                                </tr>
                                <tr>
                                    <td>Response:</td>
                                    <td>{threat?.details?.response}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <Container className='m-3'>
                        <h6>Description</h6>
                        <p>{threat?.description}</p>
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