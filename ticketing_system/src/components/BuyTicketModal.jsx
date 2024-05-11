import React, { useState, useEffect } from 'react'
import { AppImages, AppText, buyTicketInitialState, failureToast, infoToast, successToast, } from '../../helpers/AppConstants';
import { payForEvent } from '../../helpers/contractInteraction';
import { Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import PrimaryButton from './PrimaryButton';
import TextInputComp from './TextInputComp';

export default function BuyTicketModal(props) {
    const { onHide, selectedAccount, updateEvents, selectedEvent } = props
    const [buyTicket, setBuyTicket] = useState(buyTicketInitialState)
    const [successData, setSuccessData] = useState(null)

    useEffect(() => {
        if (selectedEvent) {
            setBuyTicket({ ...buyTicket, amount: parseInt(selectedEvent.ticket_price) })
        }
    }, [selectedEvent])


    const handlePayment = () => {
        // if (buyTicket.amount > 0) {
        payForEvent(selectedEvent.id, buyTicket.amount, selectedAccount)
            .then((resp) => {
                console.log("payForEvent resp", resp)
                // successToast("Tickets purchased successfully")
                // onHide()
                // setBuyTicket(buyTicketInitialState)
                updateEvents()
                setSuccessData(resp)
            })
            .catch((error) => {
                console.log("payForEvent error", error)
                failureToast(AppText.unable_to_buy_ticket)
            })
        // } else {
        //     infoToast("Invalid amount")
        // }
    }

    const onClose = () => {
        onHide()
        // setBuyTicket(buyTicketInitialState)
        setSuccessData(null)
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
                    {AppText.buy_tickets}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {successData == null ?
                    <section id="contact" className="section-bg wow fadeInUp">
                        <div className="form">
                            <form action="" method="post" role="form" className="   ">
                                <p>{AppText.are_you_sure_you_want_to_buy_ticket}</p>
                                <Row>

                                    <TextInputComp
                                        className='col '
                                        inputLabel={AppText.tickets_quantity}
                                        type='number'
                                        value={buyTicket.ticketCount}
                                        // onChange={(e) => setBuyTicket({ ...buyTicket, ticketCount: e })}
                                        isDisable={true}
                                    />
                                    <TextInputComp
                                        className='col '
                                        inputLabel={AppText.amount_wei}
                                        type='number'
                                        value={buyTicket.amount}
                                        // onChange={(e) => setBuyTicket({ ...buyTicket, amount: e })}
                                        isDisable={true}
                                    />
                                </Row>
                            </form>
                        </div>
                    </section>
                    :
                    <div className="modal-body">
                        <div className="thank-you-pop">
                            <img src={AppImages.success} alt="" />
                            <h1>{AppText.thank_you}</h1>
                            <p>{AppText.you_have_bought_this_ticket}</p>
                            <h3 className="cupon-pop">{AppText.transaction_hash} <span>{successData.transactionHash}</span></h3>
                        </div>
                    </div>
                }
            </Modal.Body>
            {successData == null &&
                <Modal.Footer>
                    <PrimaryButton
                        className="bg-dark "
                        btnTitle={AppText.no}
                        handleOnClick={() => {
                            onHide()
                            // setBuyTicket(buyTicketInitialState)
                        }}
                    />
                    <PrimaryButton
                        btnTitle={AppText.yes}
                        handleOnClick={() => {
                            handlePayment()
                        }}
                    />
                </Modal.Footer>
            }
        </Modal>
    );
}
