import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';


export default function MetaError(props) {
    const { onHide } = props



    const onClose = () => {
        onHide()
        // setBuyTicket(buyTicketInitialState)
        
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => onClose()}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {"Wallet not found"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-body">
                        <div className="thank-you-pop">
                            
                    
                            <p>{`"You don't have the MetaMask wallet browser extension. Please install it and proceed."`}</p>
                            
                        </div>
                    </div>         
            </Modal.Body>
        </Modal>
    );
}
