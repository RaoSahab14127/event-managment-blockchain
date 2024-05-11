import React, { useState } from 'react'
import upload from '../utits/uploads.js'
import { Row } from 'react-bootstrap';
import { appLogger } from '../../helpers/common';
import { UploadFileApi} from '../api/ApiMethods';
import { addEvent, getNextAvailableEventId } from '../../helpers/contractInteraction';
import {
  AppConstants,
  AppText,
  eventsIniitalState,
  failureToast,
  infoToast,
  successToast, validateFieldsGlobal
} from '../../helpers/AppConstants';
import Modal from 'react-bootstrap/Modal';
import PrimaryButton from './PrimaryButton';
import TextInputComp from './TextInputComp';
import moment from 'moment';

export default function AddEventModal(props) {
  const { onHide, selectedAccount, updateEvents } = props
  const [event, setEvent] = useState(eventsIniitalState)

  const handleChange = (value, key) => {
    setEvent({ ...event, [key]: value })
  }

  const handleEventImage = (file) => {
    setEvent({ ...event, img_url: "" })
    uploadImage(file)

  }

  const uploadImage = async (selectedFile) => {
    upload(selectedFile)
    .then((resp) => {

      if (resp) {
        setEvent({ ...event, img_url: resp })
      }
    })
    
  }

  const handleAddEvent =async () => {
    const evenid = await getNextAvailableEventId()
       
      
    

    
    if ((event)) {
      if (moment(event.event_end_time).isAfter(event.event_start_time)) {
        const body = {
          ticketCount: event.ticket_count,
          isActive: true,
          ticketPrice: event.ticket_price,
          eventStartTime: event.event_start_time,
          eventEndTime: event.event_end_time,
          from: selectedAccount
        }
        const body2 = {
          event_id:  Number(evenid),
          image_url: event.img_url,
          title: event.title,
          des: event.description,
        }
        UploadFileApi(body2)
       
        addEvent(body)
          .then((resp) => {
            appLogger("add event resp", resp)
            successToast(AppText.event_added_successfully)
            onHide()
            updateEvents()
            setEvent(eventsIniitalState)
          })
          .catch((error) => {
            appLogger("add event error", error)
            failureToast(AppText.unable_to_add_event)
          })
      } else {
        infoToast(AppText.event_end_date_should_be_greater_than_event_start_date)
      }
    } else {
      infoToast(AppText.all_fields_are_required)
    }
  }


  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => {
        onHide()
        setEvent(eventsIniitalState)
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {AppText.add_event}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <section id="contact" className="section-bg wow fadeInUp">
          <div className="form">
            <form action="" method="post" role="form" className="   ">
              <Row>
                <TextInputComp
                  className='col-sm-12  col-md-6 col-lg-6'
                  placeholder={AppText.title}
                  inputLabel={AppText.title}
                  type='text'
                  value={event.title}
                  onChange={(e) => handleChange(e, "title")}
                />
                <TextInputComp
                  className='col-sm-12  col-md-6 col-lg-6'
                  placeholder={AppText.description}
                  inputLabel={AppText.description}
                  type='text'
                  value={event.description}
                  onChange={(e) => handleChange(e, "description")}
                />
                <TextInputComp
                  className='col '
                  inputLabel={AppText.ticket_price_wei}
                  type='number'
                  value={event.ticket_price}
                  onChange={(e) => handleChange(e, "ticket_price")}
                />
                <TextInputComp
                  className='col '
                  inputLabel={AppText.tickets_quantity}
                  type='number'
                  value={event.ticket_count}
                  onChange={(e) => handleChange(e, "ticket_count")}
                />
              </Row>
              <TextInputComp
                className='col '
                inputLabel={AppText.start_date}
                type='datetime-local'
                value={event.event_start_time}
                onChange={(e) => handleChange(e, "event_start_time")}
              />
              <TextInputComp
                className='col '
                inputLabel={AppText.end_date}
                type='datetime-local'
                value={event.event_end_time}
                onChange={(e) => handleChange(e, "event_end_time")}
              />
              <TextInputComp 
                className='col '
                inputLabel={AppText.select_image}
                type='file'
                // value={event.event_img}
                onChange={(e) => handleEventImage(e)}
              />
              {event.img_url &&
                <div className='w-100'>
                  <img
                    className='  '
                    style={{ width: "200px", height: "200px", objectFit: "cover", alignSelf: 'center', backgroundColor: "red" }}
                    src={event.img_url}
                  // src={event.img_url}
                  />
                </div>
              }
            </form>
          </div>
        </section>

      </Modal.Body>
      <Modal.Footer>
        <PrimaryButton
          className="bg-dark "
          btnTitle={AppText.close}
          handleOnClick={() => {
            onHide()
            setEvent(eventsIniitalState)
          }}
        />
        <PrimaryButton
          btnTitle={AppText.add}
          handleOnClick={() => { handleAddEvent() }}
        />
      </Modal.Footer>
    </Modal>
  );
}